import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { isNil } from 'lodash';
import * as passport from 'passport';
import { jwtSecret } from './config/jwt';
import { ArmyDto } from './entity/Army';
import { Request } from './models';
import { ArmyModel } from './mongo/models';
import { passportInit } from './passport/init';

export const createApp = (): express.Express => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/', (req, res) => {
    res.send('Hello World');
  });

  app.get('/sse', (req, res) => {
    res.write('Connected');
    res.write('Hello');
    req.on('close', () => {
      console.log('closed');
    });
  });

  const authenticate = passportInit(passport);

  app.post(
    '/join',
    async (req: Request<ArmyDto>, res, next) => {
      const { headers } = req;
      if (!Object.keys(headers).includes('authorization')) {
        const { body: armyDto } = req;

        const { name, squadCount } = armyDto;

        // TODO validate args
        if (isNil(name) || isNil(squadCount)) {
          res.status(400);

          return res.json({
            error: '"name" and "squadCount" parameters are required',
          });
        }

        await ArmyModel.create({ ...armyDto, active: true });

        const activeArmies = await ArmyModel.find({ active: true });

        const token = jwt.sign({ army: { name, squadCount } }, jwtSecret);
        return res.json({ token, armies: activeArmies });
      }

      return next();
    },
    authenticate,
    async (req, res) => {
      const activeArmies = await ArmyModel.find({ active: true });

      return res.json({ armies: activeArmies });
    },
  );

  app.get('/armies', authenticate, async (req, res) => {
    const {
      query: { active },
    } = req;

    if (['true', 'false'].includes(req.query.active)) {
      return res.json(await ArmyModel.find({ active }));
    }

    return res.json(await ArmyModel.find());
  });

  return app;
};
