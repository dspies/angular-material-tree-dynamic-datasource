import { CollectionViewer, DataSource, SelectionChange } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { StorageContainer } from './storage-container';
import { StorageContainerNode } from './storage-container-node';
import { StorageContainerService } from './storage-container.service';

/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
export class StorageContainerDataSource implements DataSource<StorageContainerNode> {
  dataChange = new BehaviorSubject<StorageContainerNode[]>([]);

  get data(): StorageContainerNode[] {
    return this.dataChange.value;
  }
  set data(value: StorageContainerNode[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(
    private _treeControl: FlatTreeControl<StorageContainerNode>,
    private service: StorageContainerService
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<StorageContainerNode[]> {
    this._treeControl.expansionModel.changed.subscribe(change => {
      if (
        (change as SelectionChange<StorageContainerNode>).added ||
        (change as SelectionChange<StorageContainerNode>).removed
      ) {
        this.handleTreeControl(change as SelectionChange<StorageContainerNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(
      map(() => this.data)
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {}

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<StorageContainerNode>) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed
        .slice()
        .reverse()
        .forEach(node => this.toggleNode(node, false));
    }
  }

  /**
   * Toggle the node, remove from display list
   */
  toggleNode(node: StorageContainerNode, expand: boolean) {

    node.isLoading = true;

    this.service.get(node.id)
    .pipe(
      tap((storageContainer: StorageContainer) => {
        const index = this.data.indexOf(node);
        const childContainers = storageContainer.containerPositions;
        if (!childContainers || index < 0) { // If no children, or cannot find the node, no op
          return;
        }

        if (expand) {
          const nodes = childContainers.map((container: StorageContainer) =>
            new StorageContainerNode(container.id, container.name, !container.allowsSamples, node.level + 1));
          this.data.splice(index + 1, 0, ...nodes);
        } else {
          let count = 0;
          for (let i = index + 1; i < this.data.length
            && this.data[i].level > node.level; i++, count++) {}
          this.data.splice(index + 1, count);
        }
  
        // notify the change
        this.dataChange.next(this.data);
        node.isLoading = false;
      })
    )
    .subscribe();
  }
}
