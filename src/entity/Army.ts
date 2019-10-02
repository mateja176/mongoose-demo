export interface ArmyDto {
  name: string;

  squadCount: number;
}

export interface Army extends ArmyDto {
  id: string;

  active: boolean;
}

export type ArmySerialized = Army;

// export const ArmyModel = new ArmyEntity().getModelForClass(ArmyEntity);
