import {
  CollectionViewer,
  SelectionChange,
  DataSource
} from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable } from '@angular/core';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DynamicDataSource } from './dynamic-data-source';
import { DynamicDatabase } from './dynamic-database';
import { DynamicFlatNode } from './dynamic-flat-node';

/**
 * @title Tree with dynamic data
 */
@Component({
  selector: 'tree-dynamic-example',
  templateUrl: 'tree-dynamic-example.html',
  styleUrls: ['tree-dynamic-example.css']
})
export class TreeDynamicExample {
  constructor(database: DynamicDatabase) {
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new DynamicDataSource(this.treeControl, database);

    this.dataSource.data = database.initialData();
  }

  treeControl: FlatTreeControl<DynamicFlatNode>;

  dataSource: DynamicDataSource;

  getLevel = (node: DynamicFlatNode) => node.level;

  isExpandable = (node: DynamicFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;
}

/**  Copyright 2021 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
