import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { StorageContainer } from '../storage-container';
import { StorageContainerNode } from '../storage-container-node';
import { StorageContainerDataSource } from '../storage-container.dataSource';
import { StorageContainerService } from '../storage-container.service';

@Component({
  selector: 'app-storage-container-tree',
  templateUrl: './storage-container-tree.component.html',
  styleUrls: ['./storage-container-tree.component.css']
})
export class StorageContainerTreeComponent implements OnInit {
  treeControl: FlatTreeControl<StorageContainerNode>;
  dataSource: StorageContainerDataSource;

  constructor(private service: StorageContainerService) {
    this.treeControl = new FlatTreeControl<StorageContainerNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new StorageContainerDataSource(this.treeControl, service);
  }
  ngOnInit(): void {
    console.log('ngOnInit');
    this.service
      .list()
      .pipe(
        tap((storageContainers: StorageContainer[]) => {
          this.dataSource.data = storageContainers.map(container => {
            return new StorageContainerNode(
              container.id,
              container.name,
              !container.allowsSamples,
              0
            );
          });
        })
      )
      .subscribe();
  }

  getLevel = (node: StorageContainerNode) => node.level;

  isExpandable = (node: StorageContainerNode) => !node.allowsSamples;

  hasChild = (_: number, node: StorageContainerNode) => !node.allowsSamples;
}
