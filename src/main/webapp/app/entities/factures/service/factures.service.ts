import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFactures, getFacturesIdentifier } from '../factures.model';

export type EntityResponseType = HttpResponse<IFactures>;
export type EntityArrayResponseType = HttpResponse<IFactures[]>;

@Injectable({ providedIn: 'root' })
export class FacturesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/factures');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(factures: IFactures): Observable<EntityResponseType> {
    return this.http.post<IFactures>(this.resourceUrl, factures, { observe: 'response' });
  }

  update(factures: IFactures): Observable<EntityResponseType> {
    return this.http.put<IFactures>(`${this.resourceUrl}/${getFacturesIdentifier(factures) as number}`, factures, { observe: 'response' });
  }

  partialUpdate(factures: IFactures): Observable<EntityResponseType> {
    return this.http.patch<IFactures>(`${this.resourceUrl}/${getFacturesIdentifier(factures) as number}`, factures, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFactures>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFactures[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFacturesToCollectionIfMissing(facturesCollection: IFactures[], ...facturesToCheck: (IFactures | null | undefined)[]): IFactures[] {
    const factures: IFactures[] = facturesToCheck.filter(isPresent);
    if (factures.length > 0) {
      const facturesCollectionIdentifiers = facturesCollection.map(facturesItem => getFacturesIdentifier(facturesItem)!);
      const facturesToAdd = factures.filter(facturesItem => {
        const facturesIdentifier = getFacturesIdentifier(facturesItem);
        if (facturesIdentifier == null || facturesCollectionIdentifiers.includes(facturesIdentifier)) {
          return false;
        }
        facturesCollectionIdentifiers.push(facturesIdentifier);
        return true;
      });
      return [...facturesToAdd, ...facturesCollection];
    }
    return facturesCollection;
  }
}
