import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GoodsReceivedNote } from './goods-received-note';
import { BaseRepository, EntityLogInfo } from '../../repository/base-repository';
import {
  GET_GOODS_RECEIVED_NOTE,
  GET_GOODS_RECEIVED_NOTES,
  ADD_GOODS_RECEIVED_NOTE,
  UPDATE_GOODS_RECEIVED_NOTE,
  DELETE_GOODS_RECEIVED_NOTE,
} from './goods-received-note.queries';

/**
 * Goods Received Note Repository
 * Handles all goods received note-related data operations
 */
@Injectable({
  providedIn: 'root',
})
export class GoodsReceivedNoteRepository extends BaseRepository<GoodsReceivedNote> {
  constructor(protected override apollo: Apollo) {
    super(apollo);
  }

  /**
   * Get goods received note by ID
   */
  override get(id: string): Observable<GoodsReceivedNote> {
    return this.apollo
      .query<{ goodsReceivedNotes: GoodsReceivedNote[] }>({
        query: GET_GOODS_RECEIVED_NOTE,
        variables: { id: parseInt(id) },
      })
      .pipe(map((result) => result.data.goodsReceivedNotes[0]));
  }

  /**
   * Get all goods received notes
   */
  override getAll(): Observable<GoodsReceivedNote[]> {
    return this.apollo
      .watchQuery<{ goodsReceivedNotes: { nodes: GoodsReceivedNote[] } }>({
        query: GET_GOODS_RECEIVED_NOTES,
      })
      .valueChanges.pipe(map((result) => result.data.goodsReceivedNotes.nodes));
  }

  /**
   * Create a new goods received note
   */
  override create(
    data: Partial<GoodsReceivedNote>,
    logInfo: EntityLogInfo
  ): Observable<Partial<GoodsReceivedNote>> {
    return this.apollo
      .mutate<{ addGoodsReceivedNote: GoodsReceivedNote }>({
        mutation: ADD_GOODS_RECEIVED_NOTE,
        variables: { input: { ...data, createdBy: logInfo.userId } },
        refetchQueries: [{ query: GET_GOODS_RECEIVED_NOTES }],
      })
      .pipe(
        map((result) => {
          if (result.data?.addGoodsReceivedNote) {
            return result.data.addGoodsReceivedNote;
          }
          throw new Error('Cannot create goods received note.');
        })
      );
  }

  /**
   * Update an existing goods received note
   */
  override update(
    goodsReceivedNote: Partial<GoodsReceivedNote>,
    logInfo: EntityLogInfo
  ): Observable<Partial<GoodsReceivedNote>> {
    return this.apollo
      .mutate<{ updateGoodsReceivedNote: GoodsReceivedNote }>({
        mutation: UPDATE_GOODS_RECEIVED_NOTE,
        variables: { input: { ...goodsReceivedNote, updatedBy: logInfo.userId } },
      })
      .pipe(
        map((result) => {
          if (result.data?.updateGoodsReceivedNote) {
            return result.data.updateGoodsReceivedNote;
          }
          throw new Error('Cannot update goods received note.');
        })
      );
  }

  /**
   * Delete a goods received note
   */
  override delete(id: string, logInfo: EntityLogInfo): Observable<boolean> {
    return this.apollo
      .mutate<{ deleteGoodsReceivedNote: boolean }>({
        mutation: DELETE_GOODS_RECEIVED_NOTE,
        variables: { id: parseInt(id) },
        refetchQueries: [{ query: GET_GOODS_RECEIVED_NOTES }],
      })
      .pipe(
        map((result) => {
          if (result.data?.deleteGoodsReceivedNote) {
            return result.data.deleteGoodsReceivedNote;
          }
          throw new Error('Cannot delete goods received note.');
        })
      );
  }
}
