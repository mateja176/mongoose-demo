export interface ArmyDto {
  name: string;

  squadCount: number;
}

export interface Army extends ArmyDto {
  id: string;

  active: boolean;
}

export interface ArmySerialized extends Army {}
