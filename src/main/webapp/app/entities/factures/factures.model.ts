export interface IFactures {
  id?: number;
  object?: string | null;
  description?: string | null;
  creationDate?: string | null;
}

export class Factures implements IFactures {
  constructor(public id?: number, public object?: string | null, public description?: string | null, public creationDate?: string | null) {}
}

export function getFacturesIdentifier(factures: IFactures): number | undefined {
  return factures.id;
}
