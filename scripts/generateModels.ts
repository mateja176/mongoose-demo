import * as fs from 'fs';
import { join } from 'path';
import * as ts from 'typescript';

const tsConfig = JSON.parse(
  fs.readFileSync(join(__dirname, '../tsconfig.json'), { encoding: 'UTF8' }),
);

export const generateModels = (path = 'entity') => {
  const entitiesPath = join(__dirname, '..', 'src', path);

  const paths = fs.readdirSync(entitiesPath);

  paths.forEach(p => {
    const fullPath = join(entitiesPath, p);
    if (fs.lstatSync(fullPath).isDirectory()) {
      generateModels(p);
    }
    if (p.endsWith('.ts')) {
      const types = fs.readFileSync(fullPath, { encoding: 'UTF8' });

      // console.log(types);

      const output = ts.transpileModule(types, tsConfig);

      console.log(output);
    }
  });
};

generateModels();
