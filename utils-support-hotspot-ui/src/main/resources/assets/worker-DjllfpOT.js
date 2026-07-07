(function () {
  'use strict';

  /******************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  /* global Reflect, Promise, SuppressedError, Symbol, Iterator */


  function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
  }

  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }

  typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
  };

  var WILDCARD = '*';
  /* event-emitter */
  var EventEmitter = /** @class */ (function () {
      function EventEmitter() {
          this._events = {};
      }
      /**
       * 监听一个事件
       * @param evt
       * @param callback
       * @param once
       */
      EventEmitter.prototype.on = function (evt, callback, once) {
          if (!this._events[evt]) {
              this._events[evt] = [];
          }
          this._events[evt].push({
              callback: callback,
              once: !!once,
          });
          return this;
      };
      /**
       * 监听一个事件一次
       * @param evt
       * @param callback
       */
      EventEmitter.prototype.once = function (evt, callback) {
          return this.on(evt, callback, true);
      };
      /**
       * 触发一个事件
       * @param evt
       * @param args
       */
      EventEmitter.prototype.emit = function (evt) {
          var _this = this;
          var args = [];
          for (var _i = 1; _i < arguments.length; _i++) {
              args[_i - 1] = arguments[_i];
          }
          var events = this._events[evt] || [];
          var wildcardEvents = this._events[WILDCARD] || [];
          // 实际的处理 emit 方法
          var doEmit = function (es) {
              var length = es.length;
              for (var i = 0; i < length; i++) {
                  if (!es[i]) {
                      continue;
                  }
                  var _a = es[i], callback = _a.callback, once = _a.once;
                  if (once) {
                      es.splice(i, 1);
                      if (es.length === 0) {
                          delete _this._events[evt];
                      }
                      length--;
                      i--;
                  }
                  callback.apply(_this, args);
              }
          };
          doEmit(events);
          doEmit(wildcardEvents);
      };
      /**
       * 取消监听一个事件，或者一个channel
       * @param evt
       * @param callback
       */
      EventEmitter.prototype.off = function (evt, callback) {
          if (!evt) {
              // evt 为空全部清除
              this._events = {};
          }
          else {
              if (!callback) {
                  // evt 存在，callback 为空，清除事件所有方法
                  delete this._events[evt];
              }
              else {
                  // evt 存在，callback 存在，清除匹配的
                  var events = this._events[evt] || [];
                  var length_1 = events.length;
                  for (var i = 0; i < length_1; i++) {
                      if (events[i].callback === callback) {
                          events.splice(i, 1);
                          length_1--;
                          i--;
                      }
                  }
                  if (events.length === 0) {
                      delete this._events[evt];
                  }
              }
          }
          return this;
      };
      /* 当前所有的事件 */
      EventEmitter.prototype.getEvents = function () {
          return this._events;
      };
      return EventEmitter;
  }());

  function doBFS(queue, visited, fn, navigator) {
      while (queue.length) {
          const node = queue.shift();
          const abort = fn(node);
          if (abort) {
              return true;
          }
          visited.add(node.id);
          navigator(node.id).forEach((n) => {
              if (!visited.has(n.id)) {
                  visited.add(n.id);
                  queue.push(n);
              }
          });
      }
      return false;
  }
  function doDFS$1(node, visited, fn, navigator) {
      const abort = fn(node);
      if (abort) {
          return true;
      }
      visited.add(node.id);
      for (const n of navigator(node.id)) {
          if (!visited.has(n.id)) {
              if (doDFS$1(n, visited, fn, navigator)) {
                  return true;
              }
          }
      }
      return false;
  }

  const defaultFilter = () => true;
  class GraphView {
      graph;
      nodeFilter;
      edgeFilter;
      // caches
      cacheEnabled;
      inEdgesMap = new Map();
      outEdgesMap = new Map();
      bothEdgesMap = new Map();
      allNodesMap = new Map();
      allEdgesMap = new Map();
      constructor(options) {
          this.graph = options.graph;
          const nodeFilter = options.nodeFilter || defaultFilter;
          const edgeFilter = options.edgeFilter || defaultFilter;
          this.nodeFilter = nodeFilter;
          this.edgeFilter = (edge) => {
              const { source, target } = this.graph.getEdgeDetail(edge.id);
              if (!nodeFilter(source) || !nodeFilter(target)) {
                  return false;
              }
              return edgeFilter(edge, source, target);
          };
          if (options.cache === 'auto') {
              this.cacheEnabled = true;
              this.startAutoCache();
          }
          else if (options.cache === 'manual') {
              this.cacheEnabled = true;
          }
          else {
              this.cacheEnabled = false;
          }
      }
      /**
       * Clear all cache data. Therefore `getAllNodes()` will return `[]`.
       * If you want to disable caching, use `graphView.cacheEnabled = false` instead.
       */
      clearCache = () => {
          this.inEdgesMap.clear();
          this.outEdgesMap.clear();
          this.bothEdgesMap.clear();
          this.allNodesMap.clear();
          this.allEdgesMap.clear();
      };
      /**
       * Fully refresh all cache data to the current graph state.
       */
      refreshCache = () => {
          this.clearCache();
          this.updateCache(this.graph.getAllNodes().map((node) => node.id));
      };
      /**
       * Instead of a fully refreshment, this method partially update the cache data by specifying
       * involved(added, removed, updated) nodes. It's more efficient when handling small changes
       * on a large graph.
       */
      updateCache = (involvedNodeIds) => {
          const involvedEdgeIds = new Set();
          involvedNodeIds.forEach((id) => {
              // Collect all involved old edges.
              const oldEdgesSet = this.bothEdgesMap.get(id);
              if (oldEdgesSet) {
                  oldEdgesSet.forEach((edge) => involvedEdgeIds.add(edge.id));
              }
              if (!this.hasNode(id)) {
                  // When an involved node becomes unvisitable:
                  // 1. Delete its related edges cache.
                  this.inEdgesMap.delete(id);
                  this.outEdgesMap.delete(id);
                  this.bothEdgesMap.delete(id);
                  // 2. Delete it from the allNodesMap.
                  this.allNodesMap.delete(id);
              }
              else {
                  // When an involved node becomes or stays visitable:
                  // 1. Collect its new edges.
                  const inEdges = this.graph
                      .getRelatedEdges(id, 'in')
                      .filter(this.edgeFilter);
                  const outEdges = this.graph
                      .getRelatedEdges(id, 'out')
                      .filter(this.edgeFilter);
                  const bothEdges = Array.from(new Set([...inEdges, ...outEdges]));
                  bothEdges.forEach((edge) => involvedEdgeIds.add(edge.id));
                  // 2. Update its related edges cache.
                  this.inEdgesMap.set(id, inEdges);
                  this.outEdgesMap.set(id, outEdges);
                  this.bothEdgesMap.set(id, bothEdges);
                  // 3. Add to allNodesMap.
                  this.allNodesMap.set(id, this.graph.getNode(id));
              }
          });
          // Update allEdgesMap.
          involvedEdgeIds.forEach((id) => {
              if (this.hasEdge(id)) {
                  this.allEdgesMap.set(id, this.graph.getEdge(id));
              }
              else {
                  this.allEdgesMap.delete(id);
              }
          });
      };
      startAutoCache() {
          this.refreshCache();
          this.graph.on('changed', this.handleGraphChanged);
      }
      stopAutoCache() {
          this.graph.off('changed', this.handleGraphChanged);
      }
      handleGraphChanged = (event) => {
          // Collect all involved nodes.
          const involvedNodeIds = new Set();
          event.changes.forEach((change) => {
              switch (change.type) {
                  case 'NodeAdded':
                      involvedNodeIds.add(change.value.id);
                      break;
                  case 'NodeDataUpdated':
                      involvedNodeIds.add(change.id);
                      break;
                  case 'EdgeAdded':
                      involvedNodeIds.add(change.value.source);
                      involvedNodeIds.add(change.value.target);
                      break;
                  case 'EdgeUpdated':
                      if (change.propertyName === 'source' ||
                          change.propertyName === 'target') {
                          involvedNodeIds.add(change.oldValue);
                          involvedNodeIds.add(change.newValue);
                      }
                      break;
                  case 'EdgeDataUpdated':
                      if (event.graph.hasEdge(change.id)) {
                          const edge = event.graph.getEdge(change.id);
                          involvedNodeIds.add(edge.source);
                          involvedNodeIds.add(edge.target);
                      }
                      break;
                  case 'EdgeRemoved':
                      involvedNodeIds.add(change.value.source);
                      involvedNodeIds.add(change.value.target);
                      break;
                  case 'NodeRemoved':
                      involvedNodeIds.add(change.value.id);
                      break;
              }
          });
          // Update their caches.
          this.updateCache(involvedNodeIds);
      };
      // ================= Node =================
      checkNodeExistence(id) {
          this.getNode(id);
      }
      hasNode(id) {
          if (!this.graph.hasNode(id))
              return false;
          const node = this.graph.getNode(id);
          return this.nodeFilter(node);
      }
      areNeighbors(firstNodeId, secondNodeId) {
          this.checkNodeExistence(firstNodeId);
          return this.getNeighbors(secondNodeId).some((neighbor) => neighbor.id === firstNodeId);
      }
      getNode(id) {
          const node = this.graph.getNode(id);
          if (!this.nodeFilter(node)) {
              throw new Error('Node not found for id: ' + id);
          }
          return node;
      }
      getRelatedEdges(id, direction) {
          this.checkNodeExistence(id);
          if (this.cacheEnabled) {
              if (direction === 'in') {
                  return this.inEdgesMap.get(id);
              }
              else if (direction === 'out') {
                  return this.outEdgesMap.get(id);
              }
              else {
                  return this.bothEdgesMap.get(id);
              }
          }
          const edges = this.graph.getRelatedEdges(id, direction);
          return edges.filter(this.edgeFilter);
      }
      getDegree(id, direction) {
          return this.getRelatedEdges(id, direction).length;
      }
      getSuccessors(id) {
          const outEdges = this.getRelatedEdges(id, 'out');
          const targets = outEdges.map((edge) => this.getNode(edge.target));
          return Array.from(new Set(targets));
      }
      getPredecessors(id) {
          const inEdges = this.getRelatedEdges(id, 'in');
          const sources = inEdges.map((edge) => this.getNode(edge.source));
          return Array.from(new Set(sources));
      }
      getNeighbors(id) {
          const predecessors = this.getPredecessors(id);
          const successors = this.getSuccessors(id);
          return Array.from(new Set([...predecessors, ...successors]));
      }
      // ================= Edge =================
      hasEdge(id) {
          if (!this.graph.hasEdge(id))
              return false;
          const edge = this.graph.getEdge(id);
          return this.edgeFilter(edge);
      }
      getEdge(id) {
          const edge = this.graph.getEdge(id);
          if (!this.edgeFilter(edge)) {
              throw new Error('Edge not found for id: ' + id);
          }
          return edge;
      }
      getEdgeDetail(id) {
          const edge = this.getEdge(id);
          return {
              edge,
              source: this.getNode(edge.source),
              target: this.getNode(edge.target),
          };
      }
      // ================= Tree =================
      hasTreeStructure(treeKey) {
          return this.graph.hasTreeStructure(treeKey);
      }
      getRoots(treeKey) {
          return this.graph.getRoots(treeKey).filter(this.nodeFilter);
      }
      getChildren(id, treeKey) {
          this.checkNodeExistence(id);
          return this.graph.getChildren(id, treeKey).filter(this.nodeFilter);
      }
      getParent(id, treeKey) {
          this.checkNodeExistence(id);
          const parent = this.graph.getParent(id, treeKey);
          if (!parent || !this.nodeFilter(parent))
              return null;
          return parent;
      }
      // ================= Graph =================
      getAllNodes() {
          if (this.cacheEnabled) {
              return Array.from(this.allNodesMap.values());
          }
          return this.graph.getAllNodes().filter(this.nodeFilter);
      }
      getAllEdges() {
          if (this.cacheEnabled) {
              return Array.from(this.allEdgesMap.values());
          }
          return this.graph.getAllEdges().filter(this.edgeFilter);
      }
      bfs(id, fn, direction = 'out') {
          const navigator = {
              in: this.getPredecessors.bind(this),
              out: this.getSuccessors.bind(this),
              both: this.getNeighbors.bind(this),
          }[direction];
          doBFS([this.getNode(id)], new Set(), fn, navigator);
      }
      dfs(id, fn, direction = 'out') {
          const navigator = {
              in: this.getPredecessors.bind(this),
              out: this.getSuccessors.bind(this),
              both: this.getNeighbors.bind(this),
          }[direction];
          doDFS$1(this.getNode(id), new Set(), fn, navigator);
      }
  }

  class Graph extends EventEmitter {
      nodeMap = new Map();
      edgeMap = new Map();
      inEdgesMap = new Map();
      outEdgesMap = new Map();
      bothEdgesMap = new Map();
      treeIndices = new Map();
      changes = [];
      batchCount = 0;
      /**
       * This function is called with a {@link GraphChangedEvent} each time a graph change happened.
       *
       * `event.changes` contains all the graph changes in order since last `onChanged`.
       */
      onChanged = () => {
          // Do nothing.
      };
      /**
       * Create a new Graph instance.
       * @param options - The options to initialize a graph. See {@link GraphOptions}.
       *
       * ```ts
       * const graph = new Graph({
       *   // Optional, initial nodes.
       *   nodes: [
       *     // Each node has a unique ID.
       *     { id: 'A', foo: 1 },
       *     { id: 'B', foo: 1 },
       *   ],
       *   // Optional, initial edges.
       *   edges: [
       *     { id: 'C', source: 'B', target: 'B', weight: 1 },
       *   ],
       *   // Optional, called with a GraphChangedEvent.
       *   onChanged: (event) => {
       *     console.log(event);
       *   }
       * });
       * ```
       */
      constructor(options) {
          super();
          if (!options)
              return;
          if (options.nodes)
              this.addNodes(options.nodes);
          if (options.edges)
              this.addEdges(options.edges);
          if (options.tree)
              this.addTree(options.tree);
          if (options.onChanged)
              this.onChanged = options.onChanged;
      }
      /**
       * Batch several graph changes into one.
       *
       * Make several changes, but dispatch only one ChangedEvent at the end of batch:
       * ```ts
       * graph.batch(() => {
       *   graph.addNodes([]);
       *   graph.addEdges([]);
       * });
       * ```
       *
       * Batches can be nested. Only the outermost batch will dispatch a ChangedEvent:
       * ```ts
       * graph.batch(() => {
       *   graph.addNodes([]);
       *   graph.batch(() => {
       *     graph.addEdges([]);
       *   });
       * });
       * ```
       */
      batch = (fn) => {
          this.batchCount += 1;
          fn();
          this.batchCount -= 1;
          if (!this.batchCount) {
              this.commit();
          }
      };
      /**
       * Reset changes and dispatch a ChangedEvent.
       */
      commit() {
          const changes = this.changes;
          this.changes = [];
          const event = {
              graph: this,
              changes,
          };
          this.emit('changed', event);
          this.onChanged(event);
      }
      /**
       * Reduce the number of ordered graph changes by dropping or merging unnecessary changes.
       *
       * For example, if we update a node and remove it in a batch:
       *
       * ```ts
       * graph.batch(() => {
       *   graph.updateNodeData('A', 'foo', 2);
       *   graph.removeNode('A');
       * });
       * ```
       *
       * We get 2 atomic graph changes like
       *
       * ```ts
       * [
       *   { type: 'NodeDataUpdated', id: 'A', propertyName: 'foo', oldValue: 1, newValue: 2 },
       *   { type: 'NodeRemoved', value: { id: 'A', data: { foo: 2 } },
       * ]
       * ```
       *
       * Since node 'A' has been removed, we actually have no need to handle with NodeDataUpdated change.
       *
       * `reduceChanges()` here helps us remove such changes.
       */
      reduceChanges(changes) {
          let mergedChanges = [];
          changes.forEach((change) => {
              switch (change.type) {
                  case 'NodeRemoved': {
                      // NodeAdded: A added.
                      // NodeDataUpdated: A changed.
                      // TreeStructureChanged: A's parent changed.
                      // NodeRemoved: A removed. 👈🏻 Since A was removed, above three changes may be ignored.
                      let isNewlyAdded = false;
                      mergedChanges = mergedChanges.filter((pastChange) => {
                          if (pastChange.type === 'NodeAdded') {
                              const sameId = pastChange.value.id === change.value.id;
                              if (sameId) {
                                  isNewlyAdded = true;
                              }
                              return !sameId;
                          }
                          else if (pastChange.type === 'NodeDataUpdated') {
                              return pastChange.id !== change.value.id;
                          }
                          else if (pastChange.type === 'TreeStructureChanged') {
                              return pastChange.nodeId !== change.value.id;
                          }
                          return true;
                      });
                      if (!isNewlyAdded) {
                          mergedChanges.push(change);
                      }
                      break;
                  }
                  case 'EdgeRemoved': {
                      // EdgeAdded: A added.
                      // EdgeDataUpdated: A changed.
                      // EdgeDataUpdated: A's source/target changed.
                      // EdgeRemoved: A removed. 👈🏻 Since A was removed, above three changes may be ignored.
                      let isNewlyAdded = false;
                      mergedChanges = mergedChanges.filter((pastChange) => {
                          if (pastChange.type === 'EdgeAdded') {
                              const sameId = pastChange.value.id === change.value.id;
                              if (sameId) {
                                  isNewlyAdded = true;
                              }
                              return !sameId;
                          }
                          else if (pastChange.type === 'EdgeDataUpdated' ||
                              pastChange.type === 'EdgeUpdated') {
                              return pastChange.id !== change.value.id;
                          }
                          return true;
                      });
                      if (!isNewlyAdded) {
                          mergedChanges.push(change);
                      }
                      break;
                  }
                  case 'NodeDataUpdated':
                  case 'EdgeDataUpdated':
                  case 'EdgeUpdated': {
                      // NodeDataUpdated: { id: A, propertyName: 'foo', oldValue: 1, newValue: 2 }.
                      // NodeDataUpdated: { id: A, propertyName: 'foo', oldValue: 2, newValue: 3 }.
                      // 👆 Could be merged as { id: A, propertyName: 'foo', oldValue: 1, newValue: 3 }.
                      const index = mergedChanges.findIndex((pastChange) => {
                          return (pastChange.type === change.type &&
                              pastChange.id === change.id &&
                              (change.propertyName === undefined ||
                                  pastChange.propertyName === change.propertyName));
                      });
                      const existingChange = mergedChanges[index];
                      if (existingChange) {
                          if (change.propertyName !== undefined) {
                              // The incoming change is of the same property of existing change.
                              existingChange.newValue = change.newValue;
                          }
                          else {
                              // The incoming change is a whole data override.
                              mergedChanges.splice(index, 1);
                              mergedChanges.push(change);
                          }
                      }
                      else {
                          mergedChanges.push(change);
                      }
                      break;
                  }
                  case 'TreeStructureDetached': {
                      // TreeStructureAttached
                      // TreeStructureChanged
                      // TreeStructureDetached 👈🏻 Since the tree struct was detached, above 2 changes may be ignored.
                      mergedChanges = mergedChanges.filter((pastChange) => {
                          if (pastChange.type === 'TreeStructureAttached') {
                              return pastChange.treeKey !== change.treeKey;
                          }
                          else if (pastChange.type === 'TreeStructureChanged') {
                              return pastChange.treeKey !== change.treeKey;
                          }
                          return true;
                      });
                      mergedChanges.push(change);
                      break;
                  }
                  case 'TreeStructureChanged': {
                      const existingChange = mergedChanges.find((pastChange) => {
                          return (pastChange.type === 'TreeStructureChanged' &&
                              pastChange.treeKey === change.treeKey &&
                              pastChange.nodeId === change.nodeId);
                      });
                      if (existingChange) {
                          existingChange.newParentId =
                              change.newParentId;
                      }
                      else {
                          mergedChanges.push(change);
                      }
                      break;
                  }
                  default:
                      mergedChanges.push(change);
                      break;
              }
          });
          return mergedChanges;
      }
      // ================= Node =================
      checkNodeExistence(id) {
          this.getNode(id);
      }
      /**
       * Check if a node exists in the graph.
       * @group NodeMethods
       */
      hasNode(id) {
          return this.nodeMap.has(id);
      }
      /**
       * Tell if two nodes are neighbors.
       * @group NodeMethods
       */
      areNeighbors(firstNodeId, secondNodeId) {
          return this.getNeighbors(secondNodeId).some((neighbor) => neighbor.id === firstNodeId);
      }
      /**
       * Get the node data with given ID.
       * @group NodeMethods
       */
      getNode(id) {
          const node = this.nodeMap.get(id);
          if (!node) {
              throw new Error('Node not found for id: ' + id);
          }
          return node;
      }
      /**
       * Given a node ID, find all edges of the node.
       * @param id - ID of the node
       * @param direction - Edge direction, defaults to 'both'.
       * @group NodeMethods
       */
      getRelatedEdges(id, direction) {
          this.checkNodeExistence(id);
          if (direction === 'in') {
              const inEdges = this.inEdgesMap.get(id);
              return Array.from(inEdges);
          }
          else if (direction === 'out') {
              const outEdges = this.outEdgesMap.get(id);
              return Array.from(outEdges);
          }
          else {
              const bothEdges = this.bothEdgesMap.get(id);
              return Array.from(bothEdges);
          }
      }
      /**
       * Get the degree of the given node.
       * @group NodeMethods
       */
      getDegree(id, direction) {
          return this.getRelatedEdges(id, direction).length;
      }
      /**
       * Get all successors of the given node.
       */
      getSuccessors(id) {
          const outEdges = this.getRelatedEdges(id, 'out');
          const targets = outEdges.map((edge) => this.getNode(edge.target));
          return Array.from(new Set(targets));
      }
      /**
       * Get all predecessors of the given node.
       */
      getPredecessors(id) {
          const inEdges = this.getRelatedEdges(id, 'in');
          const sources = inEdges.map((edge) => this.getNode(edge.source));
          return Array.from(new Set(sources));
      }
      /**
       * Given a node ID, find its neighbors.
       * @param id - ID of the node
       * @group NodeMethods
       */
      getNeighbors(id) {
          const predecessors = this.getPredecessors(id);
          const successors = this.getSuccessors(id);
          return Array.from(new Set([...predecessors, ...successors]));
      }
      doAddNode(node) {
          if (this.hasNode(node.id)) {
              throw new Error('Node already exists: ' + node.id);
          }
          this.nodeMap.set(node.id, node);
          this.inEdgesMap.set(node.id, new Set());
          this.outEdgesMap.set(node.id, new Set());
          this.bothEdgesMap.set(node.id, new Set());
          this.treeIndices.forEach((tree) => {
              tree.childrenMap.set(node.id, new Set());
          });
          this.changes.push({ type: 'NodeAdded', value: node });
      }
      /**
       * Add all nodes of the given array, or iterable, into the graph.
       * @group NodeMethods
       */
      addNodes(nodes) {
          this.batch(() => {
              for (const node of nodes) {
                  this.doAddNode(node);
              }
          });
      }
      /**
       * Add a single node into the graph.
       * @group NodeMethods
       */
      addNode(node) {
          this.addNodes([node]);
      }
      doRemoveNode(id) {
          const node = this.getNode(id);
          const bothEdges = this.bothEdgesMap.get(id);
          bothEdges?.forEach((edge) => this.doRemoveEdge(edge.id));
          this.nodeMap.delete(id);
          this.treeIndices.forEach((tree) => {
              tree.childrenMap.get(id)?.forEach((child) => {
                  tree.parentMap.delete(child.id);
              });
              const parent = tree.parentMap.get(id);
              if (parent)
                  tree.childrenMap.get(parent.id)?.delete(node);
              tree.parentMap.delete(id);
              tree.childrenMap.delete(id);
          });
          this.bothEdgesMap.delete(id);
          this.inEdgesMap.delete(id);
          this.outEdgesMap.delete(id);
          this.changes.push({ type: 'NodeRemoved', value: node });
      }
      /**
       * Remove nodes and their attached edges from the graph.
       * @group NodeMethods
       */
      removeNodes(idList) {
          this.batch(() => {
              idList.forEach((id) => this.doRemoveNode(id));
          });
      }
      /**
       * Remove a single node and its attached edges from the graph.
       * @group NodeMethods
       */
      removeNode(id) {
          this.removeNodes([id]);
      }
      updateNodeDataProperty(id, propertyName, value) {
          const node = this.getNode(id);
          this.batch(() => {
              const oldValue = node.data[propertyName];
              const newValue = value;
              node.data[propertyName] = newValue;
              this.changes.push({
                  type: 'NodeDataUpdated',
                  id,
                  propertyName,
                  oldValue,
                  newValue,
              });
          });
      }
      /**
       * Like Object.assign, merge all properties of `path` to the node data.
       * @param id Node ID.
       * @param patch A data object to merge.
       */
      mergeNodeData(id, patch) {
          this.batch(() => {
              Object.entries(patch).forEach(([propertyName, value]) => {
                  this.updateNodeDataProperty(id, propertyName, value);
              });
          });
      }
      updateNodeData(...args) {
          const id = args[0];
          const node = this.getNode(id);
          if (typeof args[1] === 'string') {
              // id, propertyName, value
              this.updateNodeDataProperty(id, args[1], args[2]);
              return;
          }
          let data;
          if (typeof args[1] === 'function') {
              // id, update
              const update = args[1];
              data = update(node.data);
          }
          else if (typeof args[1] === 'object') {
              // id, data
              data = args[1];
          }
          this.batch(() => {
              const oldValue = node.data;
              const newValue = data;
              node.data = data;
              this.changes.push({
                  type: 'NodeDataUpdated',
                  id,
                  oldValue,
                  newValue,
              });
          });
      }
      // ================= Edge =================
      checkEdgeExistence(id) {
          if (!this.hasEdge(id)) {
              throw new Error('Edge not found for id: ' + id);
          }
      }
      /**
       * Check if an edge exists in the graph.
       * @group NodeMethods
       */
      hasEdge(id) {
          return this.edgeMap.has(id);
      }
      /**
       * Get the edge data with given ID.
       * @group EdgeMethods
       */
      getEdge(id) {
          this.checkEdgeExistence(id);
          return this.edgeMap.get(id);
      }
      /**
       * Get the edge, the source node, and the target node by an edge ID.
       * @group EdgeMethods
       */
      getEdgeDetail(id) {
          const edge = this.getEdge(id);
          return {
              edge,
              source: this.getNode(edge.source),
              target: this.getNode(edge.target),
          };
      }
      doAddEdge(edge) {
          if (this.hasEdge(edge.id)) {
              throw new Error('Edge already exists: ' + edge.id);
          }
          this.checkNodeExistence(edge.source);
          this.checkNodeExistence(edge.target);
          this.edgeMap.set(edge.id, edge);
          const inEdges = this.inEdgesMap.get(edge.target);
          const outEdges = this.outEdgesMap.get(edge.source);
          const bothEdgesOfSource = this.bothEdgesMap.get(edge.source);
          const bothEdgesOfTarget = this.bothEdgesMap.get(edge.target);
          inEdges.add(edge);
          outEdges.add(edge);
          bothEdgesOfSource.add(edge);
          bothEdgesOfTarget.add(edge);
          this.changes.push({ type: 'EdgeAdded', value: edge });
      }
      /**
       * Add all edges of the given iterable(an array, a set, etc.) into the graph.
       * @group EdgeMethods
       */
      addEdges(edges) {
          this.batch(() => {
              for (const edge of edges) {
                  this.doAddEdge(edge);
              }
          });
      }
      /**
       * Add a single edge pointing from `source` to `target` into the graph.
       *
       * ```ts
       * graph.addNode({ id: 'NodeA' });
       * graph.addNode({ id: 'NodeB' });
       * graph.addEdge({ id: 'EdgeA', source: 'NodeA', target: 'NodeB' });
       * ```
       *
       * If `source` or `target` were not found in the current graph, it throws an Error.
       * @group EdgeMethods
       */
      addEdge(edge) {
          this.addEdges([edge]);
      }
      doRemoveEdge(id) {
          const edge = this.getEdge(id);
          const outEdges = this.outEdgesMap.get(edge.source);
          const inEdges = this.inEdgesMap.get(edge.target);
          const bothEdgesOfSource = this.bothEdgesMap.get(edge.source);
          const bothEdgesOfTarget = this.bothEdgesMap.get(edge.target);
          outEdges.delete(edge);
          inEdges.delete(edge);
          bothEdgesOfSource.delete(edge);
          bothEdgesOfTarget.delete(edge);
          this.edgeMap.delete(id);
          this.changes.push({ type: 'EdgeRemoved', value: edge });
      }
      /**
       * Remove edges whose id was included in the given id list.
       * @group EdgeMethods
       */
      removeEdges(idList) {
          this.batch(() => {
              idList.forEach((id) => this.doRemoveEdge(id));
          });
      }
      /**
       * Remove a single edge of the given id.
       * @group EdgeMethods
       */
      removeEdge(id) {
          this.removeEdges([id]);
      }
      /**
       * Change the source of an edge. The source must be found in current graph.
       * @group EdgeMethods
       */
      updateEdgeSource(id, source) {
          const edge = this.getEdge(id);
          this.checkNodeExistence(source);
          const oldSource = edge.source;
          const newSource = source;
          this.outEdgesMap.get(oldSource).delete(edge);
          this.bothEdgesMap.get(oldSource).delete(edge);
          this.outEdgesMap.get(newSource).add(edge);
          this.bothEdgesMap.get(newSource).add(edge);
          edge.source = source;
          this.batch(() => {
              this.changes.push({
                  type: 'EdgeUpdated',
                  id,
                  propertyName: 'source',
                  oldValue: oldSource,
                  newValue: newSource,
              });
          });
      }
      /**
       * Change the target of an edge. The target must be found in current graph.
       * @group EdgeMethods
       */
      updateEdgeTarget(id, target) {
          const edge = this.getEdge(id);
          this.checkNodeExistence(target);
          const oldTarget = edge.target;
          const newTarget = target;
          this.inEdgesMap.get(oldTarget).delete(edge);
          this.bothEdgesMap.get(oldTarget).delete(edge);
          this.inEdgesMap.get(newTarget).add(edge);
          this.bothEdgesMap.get(newTarget).add(edge);
          edge.target = target;
          this.batch(() => {
              this.changes.push({
                  type: 'EdgeUpdated',
                  id,
                  propertyName: 'target',
                  oldValue: oldTarget,
                  newValue: newTarget,
              });
          });
      }
      updateEdgeDataProperty(id, propertyName, value) {
          const edge = this.getEdge(id);
          this.batch(() => {
              const oldValue = edge.data[propertyName];
              const newValue = value;
              edge.data[propertyName] = newValue;
              this.changes.push({
                  type: 'EdgeDataUpdated',
                  id,
                  propertyName,
                  oldValue,
                  newValue,
              });
          });
      }
      updateEdgeData(...args) {
          const id = args[0];
          const edge = this.getEdge(id);
          if (typeof args[1] === 'string') {
              // id, propertyName, value
              this.updateEdgeDataProperty(id, args[1], args[2]);
              return;
          }
          let data;
          if (typeof args[1] === 'function') {
              // id, update
              const update = args[1];
              data = update(edge.data);
          }
          else if (typeof args[1] === 'object') {
              // id, data
              data = args[1];
          }
          this.batch(() => {
              const oldValue = edge.data;
              const newValue = data;
              edge.data = data;
              this.changes.push({
                  type: 'EdgeDataUpdated',
                  id,
                  oldValue,
                  newValue,
              });
          });
      }
      /**
       * @group EdgeMethods
       */
      mergeEdgeData(id, patch) {
          this.batch(() => {
              Object.entries(patch).forEach(([propertyName, value]) => {
                  this.updateEdgeDataProperty(id, propertyName, value);
              });
          });
      }
      // ================= Tree =================
      checkTreeExistence(treeKey) {
          if (!this.hasTreeStructure(treeKey)) {
              throw new Error('Tree structure not found for treeKey: ' + treeKey);
          }
      }
      hasTreeStructure(treeKey) {
          return this.treeIndices.has(treeKey);
      }
      /**
       * Attach a new tree structure representing the hierarchy of all nodes in the graph.
       * @param treeKey A unique key of the tree structure. You can attach multiple tree structures with different keys.
       *
       * ```ts
       * const graph = new Graph({
       *   nodes: [{ id: 1 }, { id: 2 }, { id: 3 }],
       * });
       * graph.attachTreeStructure('Inheritance');
       * graph.setParent(2, 1, 'Inheritance');
       * graph.setParent(3, 1, 'Inheritance');
       * graph.getRoots('Inheritance'); // [1]
       * graph.getChildren(1, 'Inheritance'); // [2,3]
       * ```
       * @group TreeMethods
       */
      attachTreeStructure(treeKey) {
          if (this.treeIndices.has(treeKey)) {
              // Already attached.
              return;
          }
          this.treeIndices.set(treeKey, {
              parentMap: new Map(),
              childrenMap: new Map(),
          });
          this.batch(() => {
              this.changes.push({
                  type: 'TreeStructureAttached',
                  treeKey,
              });
          });
      }
      /**
       * Detach the tree structure of the given tree key from the graph.
       *
       * ```ts
       * graph.detachTreeStructure('Inheritance');
       * graph.getRoots('Inheritance'); // Error!
       * ```
       * @group TreeMethods
       */
      detachTreeStructure(treeKey) {
          this.checkTreeExistence(treeKey);
          this.treeIndices.delete(treeKey);
          this.batch(() => {
              this.changes.push({
                  type: 'TreeStructureDetached',
                  treeKey,
              });
          });
      }
      /**
       * Traverse the given tree data, add each node into the graph, then attach the tree structure.
       *
       * ```ts
       * graph.addTree({
       *   id: 1,
       *   children: [
       *     { id: 2 },
       *     { id: 3 },
       *   ],
       * }, 'Inheritance');
       * graph.getRoots('Inheritance'); // [1]
       * graph.getChildren(1, 'Inheritance'); // [2, 3]
       * graph.getAllNodes(); // [1, 2, 3]
       * graph.getAllEdges(); // []
       * ```
       * @group TreeMethods
       */
      addTree(tree, treeKey) {
          this.batch(() => {
              this.attachTreeStructure(treeKey);
              // Add Nodes
              const nodes = [];
              const stack = Array.isArray(tree) ? tree : [tree];
              while (stack.length) {
                  const node = stack.shift();
                  nodes.push(node);
                  if (node.children) {
                      stack.push(...node.children);
                  }
              }
              this.addNodes(nodes);
              // Set parent for each child node.
              nodes.forEach((parent) => {
                  parent.children?.forEach((child) => {
                      this.setParent(child.id, parent.id, treeKey);
                  });
              });
          });
      }
      /**
       * Get the root nodes of an attached tree structure.
       *
       * Consider a graph with the following tree structure attached:
       * ```
       * Tree structure:
       *    O     3
       *   / \    |
       *  1   2   4
       * ```
       * `graph.getRoots()` takes all nodes without a parent, therefore [0, 3] was returned.
       *
       * Newly added nodes are also unparented. So they are counted as roots.
       * ```ts
       * graph.addNode({ id: 5 });
       * graph.getRoots(); // [0, 3, 5]
       * ```
       *
       * Here is how the tree structure looks like:
       * ```
       * Tree structure:
       *    O     3  5
       *   / \    |
       *  1   2   4
       * ```
       *
       * By setting a parent, a root node no more be a root.
       * ```ts
       * graph.setParent(5, 2);
       * graph.getRoots(); // [0, 3]
       * ```
       *
       * The tree structure now becomes:
       * ```
       * Tree structure:
       *    O     3
       *   / \    |
       *  1   2   4
       *      |
       *      5
       * ```
       *
       * Removing a node forces its children to be unparented, or roots.
       * ```ts
       * graph.removeNode(0);
       * graph.getRoots(); // [1, 2, 3]
       * ```
       *
       * You might draw the the structure as follow:
       * ```
       * Tree structure:
       *  1   2  3
       *      |  |
       *      5  4
       * ```
       * @group TreeMethods
       */
      getRoots(treeKey) {
          this.checkTreeExistence(treeKey);
          return this.getAllNodes().filter((node) => !this.getParent(node.id, treeKey));
      }
      /**
       * Given a node ID and an optional tree key, get the children of the node in the specified tree structure.
       * @group TreeMethods
       */
      getChildren(id, treeKey) {
          this.checkNodeExistence(id);
          this.checkTreeExistence(treeKey);
          const tree = this.treeIndices.get(treeKey);
          const children = tree.childrenMap.get(id);
          return Array.from(children || []);
      }
      /**
       * Given a node ID and an optional tree key, get the parent of the node in the specified tree structure.
       * If the given node is one of the tree roots, this returns null.
       * @group TreeMethods
       */
      getParent(id, treeKey) {
          this.checkNodeExistence(id);
          this.checkTreeExistence(treeKey);
          const tree = this.treeIndices.get(treeKey);
          return tree.parentMap.get(id) || null;
      }
      /**
       * Returns an array of all the ancestor nodes, staring from the parent to the root.
       */
      getAncestors(id, treeKey) {
          const ancestors = [];
          let current = this.getNode(id);
          let parent;
          // eslint-disable-next-line no-cond-assign
          while ((parent = this.getParent(current.id, treeKey))) {
              ancestors.push(parent);
              current = parent;
          }
          return ancestors;
      }
      /**
       * Set node parent. If this operation causes a circle, it fails with an error.
       * @param id - ID of the child node.
       * @param parent - ID of the parent node. If it is undefined or null, means unset parent for node with id.
       * @param treeKey - Which tree structure the relation is applied to.
       * @group TreeMethods
       */
      setParent(id, parent, treeKey) {
          this.checkTreeExistence(treeKey);
          const tree = this.treeIndices.get(treeKey);
          if (!tree)
              return;
          const node = this.getNode(id);
          const oldParent = tree.parentMap.get(id);
          // Same parent id as old one, skip
          if (oldParent?.id === parent)
              return;
          // New parent is undefined or null, unset parent for the node
          if (parent === undefined || parent === null) {
              if (oldParent) {
                  tree.childrenMap.get(oldParent.id)?.delete(node);
              }
              tree.parentMap.delete(id);
              return;
          }
          const newParent = this.getNode(parent);
          // Set parent
          tree.parentMap.set(id, newParent);
          // Set children
          if (oldParent) {
              tree.childrenMap.get(oldParent.id)?.delete(node);
          }
          let children = tree.childrenMap.get(newParent.id);
          if (!children) {
              children = new Set();
              tree.childrenMap.set(newParent.id, children);
          }
          children.add(node);
          this.batch(() => {
              this.changes.push({
                  type: 'TreeStructureChanged',
                  treeKey,
                  nodeId: id,
                  oldParentId: oldParent?.id,
                  newParentId: newParent.id,
              });
          });
      }
      dfsTree(id, fn, treeKey) {
          const navigator = (nodeId) => this.getChildren(nodeId, treeKey);
          return doDFS$1(this.getNode(id), new Set(), fn, navigator);
      }
      bfsTree(id, fn, treeKey) {
          const navigator = (nodeId) => this.getChildren(nodeId, treeKey);
          return doBFS([this.getNode(id)], new Set(), fn, navigator);
      }
      // ================= Graph =================
      /**
       * Get all nodes in the graph as an array.
       */
      getAllNodes() {
          return Array.from(this.nodeMap.values());
      }
      /**
       * Get all edges in the graph as an array.
       */
      getAllEdges() {
          return Array.from(this.edgeMap.values());
      }
      bfs(id, fn, direction = 'out') {
          const navigator = {
              in: this.getPredecessors.bind(this),
              out: this.getSuccessors.bind(this),
              both: this.getNeighbors.bind(this),
          }[direction];
          return doBFS([this.getNode(id)], new Set(), fn, navigator);
      }
      dfs(id, fn, direction = 'out') {
          const navigator = {
              in: this.getPredecessors.bind(this),
              out: this.getSuccessors.bind(this),
              both: this.getNeighbors.bind(this),
          }[direction];
          return doDFS$1(this.getNode(id), new Set(), fn, navigator);
      }
      clone() {
          // Make a shallow copy of nodes and edges.
          const newNodes = this.getAllNodes().map((oldNode) => {
              return { ...oldNode, data: { ...oldNode.data } };
          });
          const newEdges = this.getAllEdges().map((oldEdge) => {
              return { ...oldEdge, data: { ...oldEdge.data } };
          });
          // Create a new graph with shallow copied nodes and edges.
          const newGraph = new Graph({
              nodes: newNodes,
              edges: newEdges,
          });
          // Add tree indices.
          this.treeIndices.forEach(({ parentMap: oldParentMap, childrenMap: oldChildrenMap }, treeKey) => {
              const parentMap = new Map();
              oldParentMap.forEach((parent, key) => {
                  parentMap.set(key, newGraph.getNode(parent.id));
              });
              const childrenMap = new Map();
              oldChildrenMap.forEach((children, key) => {
                  childrenMap.set(key, new Set(Array.from(children).map((n) => newGraph.getNode(n.id))));
              });
              newGraph.treeIndices.set(treeKey, {
                  parentMap: parentMap,
                  childrenMap: childrenMap,
              });
          });
          return newGraph;
      }
      toJSON() {
          return JSON.stringify({
              nodes: this.getAllNodes(),
              edges: this.getAllEdges(),
              // FIXME: And tree structures?
          });
      }
      createView(options) {
          return new GraphView({
              graph: this,
              ...options,
          });
      }
  }

  /**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: Apache-2.0
   */
  const proxyMarker = Symbol("Comlink.proxy");
  const createEndpoint = Symbol("Comlink.endpoint");
  const releaseProxy = Symbol("Comlink.releaseProxy");
  const finalizer = Symbol("Comlink.finalizer");
  const throwMarker = Symbol("Comlink.thrown");
  const isObject$1 = (val) => (typeof val === "object" && val !== null) || typeof val === "function";
  /**
   * Internal transfer handle to handle objects marked to proxy.
   */
  const proxyTransferHandler = {
      canHandle: (val) => isObject$1(val) && val[proxyMarker],
      serialize(obj) {
          const { port1, port2 } = new MessageChannel();
          expose(obj, port1);
          return [port2, [port2]];
      },
      deserialize(port) {
          port.start();
          return wrap(port);
      },
  };
  /**
   * Internal transfer handler to handle thrown exceptions.
   */
  const throwTransferHandler = {
      canHandle: (value) => isObject$1(value) && throwMarker in value,
      serialize({ value }) {
          let serialized;
          if (value instanceof Error) {
              serialized = {
                  isError: true,
                  value: {
                      message: value.message,
                      name: value.name,
                      stack: value.stack,
                  },
              };
          }
          else {
              serialized = { isError: false, value };
          }
          return [serialized, []];
      },
      deserialize(serialized) {
          if (serialized.isError) {
              throw Object.assign(new Error(serialized.value.message), serialized.value);
          }
          throw serialized.value;
      },
  };
  /**
   * Allows customizing the serialization of certain values.
   */
  const transferHandlers = new Map([
      ["proxy", proxyTransferHandler],
      ["throw", throwTransferHandler],
  ]);
  function isAllowedOrigin(allowedOrigins, origin) {
      for (const allowedOrigin of allowedOrigins) {
          if (origin === allowedOrigin || allowedOrigin === "*") {
              return true;
          }
          if (allowedOrigin instanceof RegExp && allowedOrigin.test(origin)) {
              return true;
          }
      }
      return false;
  }
  function expose(obj, ep = globalThis, allowedOrigins = ["*"]) {
      ep.addEventListener("message", function callback(ev) {
          if (!ev || !ev.data) {
              return;
          }
          if (!isAllowedOrigin(allowedOrigins, ev.origin)) {
              console.warn(`Invalid origin '${ev.origin}' for comlink proxy`);
              return;
          }
          const { id, type, path } = Object.assign({ path: [] }, ev.data);
          const argumentList = (ev.data.argumentList || []).map(fromWireValue);
          let returnValue;
          try {
              const parent = path.slice(0, -1).reduce((obj, prop) => obj[prop], obj);
              const rawValue = path.reduce((obj, prop) => obj[prop], obj);
              switch (type) {
                  case "GET" /* MessageType.GET */:
                      {
                          returnValue = rawValue;
                      }
                      break;
                  case "SET" /* MessageType.SET */:
                      {
                          parent[path.slice(-1)[0]] = fromWireValue(ev.data.value);
                          returnValue = true;
                      }
                      break;
                  case "APPLY" /* MessageType.APPLY */:
                      {
                          returnValue = rawValue.apply(parent, argumentList);
                      }
                      break;
                  case "CONSTRUCT" /* MessageType.CONSTRUCT */:
                      {
                          const value = new rawValue(...argumentList);
                          returnValue = proxy(value);
                      }
                      break;
                  case "ENDPOINT" /* MessageType.ENDPOINT */:
                      {
                          const { port1, port2 } = new MessageChannel();
                          expose(obj, port2);
                          returnValue = transfer(port1, [port1]);
                      }
                      break;
                  case "RELEASE" /* MessageType.RELEASE */:
                      {
                          returnValue = undefined;
                      }
                      break;
                  default:
                      return;
              }
          }
          catch (value) {
              returnValue = { value, [throwMarker]: 0 };
          }
          Promise.resolve(returnValue)
              .catch((value) => {
              return { value, [throwMarker]: 0 };
          })
              .then((returnValue) => {
              const [wireValue, transferables] = toWireValue(returnValue);
              ep.postMessage(Object.assign(Object.assign({}, wireValue), { id }), transferables);
              if (type === "RELEASE" /* MessageType.RELEASE */) {
                  // detach and deactive after sending release response above.
                  ep.removeEventListener("message", callback);
                  closeEndPoint(ep);
                  if (finalizer in obj && typeof obj[finalizer] === "function") {
                      obj[finalizer]();
                  }
              }
          })
              .catch((error) => {
              // Send Serialization Error To Caller
              const [wireValue, transferables] = toWireValue({
                  value: new TypeError("Unserializable return value"),
                  [throwMarker]: 0,
              });
              ep.postMessage(Object.assign(Object.assign({}, wireValue), { id }), transferables);
          });
      });
      if (ep.start) {
          ep.start();
      }
  }
  function isMessagePort(endpoint) {
      return endpoint.constructor.name === "MessagePort";
  }
  function closeEndPoint(endpoint) {
      if (isMessagePort(endpoint))
          endpoint.close();
  }
  function wrap(ep, target) {
      const pendingListeners = new Map();
      ep.addEventListener("message", function handleMessage(ev) {
          const { data } = ev;
          if (!data || !data.id) {
              return;
          }
          const resolver = pendingListeners.get(data.id);
          if (!resolver) {
              return;
          }
          try {
              resolver(data);
          }
          finally {
              pendingListeners.delete(data.id);
          }
      });
      return createProxy(ep, pendingListeners, [], target);
  }
  function throwIfProxyReleased(isReleased) {
      if (isReleased) {
          throw new Error("Proxy has been released and is not useable");
      }
  }
  function releaseEndpoint(ep) {
      return requestResponseMessage(ep, new Map(), {
          type: "RELEASE" /* MessageType.RELEASE */,
      }).then(() => {
          closeEndPoint(ep);
      });
  }
  const proxyCounter = new WeakMap();
  const proxyFinalizers = "FinalizationRegistry" in globalThis &&
      new FinalizationRegistry((ep) => {
          const newCount = (proxyCounter.get(ep) || 0) - 1;
          proxyCounter.set(ep, newCount);
          if (newCount === 0) {
              releaseEndpoint(ep);
          }
      });
  function registerProxy(proxy, ep) {
      const newCount = (proxyCounter.get(ep) || 0) + 1;
      proxyCounter.set(ep, newCount);
      if (proxyFinalizers) {
          proxyFinalizers.register(proxy, ep, proxy);
      }
  }
  function unregisterProxy(proxy) {
      if (proxyFinalizers) {
          proxyFinalizers.unregister(proxy);
      }
  }
  function createProxy(ep, pendingListeners, path = [], target = function () { }) {
      let isProxyReleased = false;
      const proxy = new Proxy(target, {
          get(_target, prop) {
              throwIfProxyReleased(isProxyReleased);
              if (prop === releaseProxy) {
                  return () => {
                      unregisterProxy(proxy);
                      releaseEndpoint(ep);
                      pendingListeners.clear();
                      isProxyReleased = true;
                  };
              }
              if (prop === "then") {
                  if (path.length === 0) {
                      return { then: () => proxy };
                  }
                  const r = requestResponseMessage(ep, pendingListeners, {
                      type: "GET" /* MessageType.GET */,
                      path: path.map((p) => p.toString()),
                  }).then(fromWireValue);
                  return r.then.bind(r);
              }
              return createProxy(ep, pendingListeners, [...path, prop]);
          },
          set(_target, prop, rawValue) {
              throwIfProxyReleased(isProxyReleased);
              // FIXME: ES6 Proxy Handler `set` methods are supposed to return a
              // boolean. To show good will, we return true asynchronously ¯\_(ツ)_/¯
              const [value, transferables] = toWireValue(rawValue);
              return requestResponseMessage(ep, pendingListeners, {
                  type: "SET" /* MessageType.SET */,
                  path: [...path, prop].map((p) => p.toString()),
                  value,
              }, transferables).then(fromWireValue);
          },
          apply(_target, _thisArg, rawArgumentList) {
              throwIfProxyReleased(isProxyReleased);
              const last = path[path.length - 1];
              if (last === createEndpoint) {
                  return requestResponseMessage(ep, pendingListeners, {
                      type: "ENDPOINT" /* MessageType.ENDPOINT */,
                  }).then(fromWireValue);
              }
              // We just pretend that `bind()` didn’t happen.
              if (last === "bind") {
                  return createProxy(ep, pendingListeners, path.slice(0, -1));
              }
              const [argumentList, transferables] = processArguments(rawArgumentList);
              return requestResponseMessage(ep, pendingListeners, {
                  type: "APPLY" /* MessageType.APPLY */,
                  path: path.map((p) => p.toString()),
                  argumentList,
              }, transferables).then(fromWireValue);
          },
          construct(_target, rawArgumentList) {
              throwIfProxyReleased(isProxyReleased);
              const [argumentList, transferables] = processArguments(rawArgumentList);
              return requestResponseMessage(ep, pendingListeners, {
                  type: "CONSTRUCT" /* MessageType.CONSTRUCT */,
                  path: path.map((p) => p.toString()),
                  argumentList,
              }, transferables).then(fromWireValue);
          },
      });
      registerProxy(proxy, ep);
      return proxy;
  }
  function myFlat(arr) {
      return Array.prototype.concat.apply([], arr);
  }
  function processArguments(argumentList) {
      const processed = argumentList.map(toWireValue);
      return [processed.map((v) => v[0]), myFlat(processed.map((v) => v[1]))];
  }
  const transferCache = new WeakMap();
  function transfer(obj, transfers) {
      transferCache.set(obj, transfers);
      return obj;
  }
  function proxy(obj) {
      return Object.assign(obj, { [proxyMarker]: true });
  }
  function toWireValue(value) {
      for (const [name, handler] of transferHandlers) {
          if (handler.canHandle(value)) {
              const [serializedValue, transferables] = handler.serialize(value);
              return [
                  {
                      type: "HANDLER" /* WireValueType.HANDLER */,
                      name,
                      value: serializedValue,
                  },
                  transferables,
              ];
          }
      }
      return [
          {
              type: "RAW" /* WireValueType.RAW */,
              value,
          },
          transferCache.get(value) || [],
      ];
  }
  function fromWireValue(value) {
      switch (value.type) {
          case "HANDLER" /* WireValueType.HANDLER */:
              return transferHandlers.get(value.name).deserialize(value.value);
          case "RAW" /* WireValueType.RAW */:
              return value.value;
      }
  }
  function requestResponseMessage(ep, pendingListeners, msg, transfers) {
      return new Promise((resolve) => {
          const id = generateUUID();
          pendingListeners.set(id, resolve);
          if (ep.start) {
              ep.start();
          }
          ep.postMessage(Object.assign({ id }, msg), transfers);
      });
  }
  function generateUUID() {
      return new Array(4)
          .fill(0)
          .map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16))
          .join("-");
  }

  /**
   * 判断值是否为函数
   * @return 是否为函数
   */
  function isFunction(value) {
      return typeof value === 'function';
  }

  /**
   * 判断值是否为 null 或 undefined
   * @return 是否为 null 或 undefined
   */
  function isNil(value) {
      return value === null || value === undefined;
  }

  /**
   * 判断值是否为数组
   * @return 是否为数组
   */
  function isArray$1(value) {
      return Array.isArray(value);
  }

  var isObject = (function (value) {
      /**
       * isObject({}) => true
       * isObject([1, 2, 3]) => true
       * isObject(Function) => true
       * isObject(null) => false
       */
      var type = typeof value;
      return (value !== null && type === 'object') || type === 'function';
  });

  function each$1(elements, func) {
      if (!elements) {
          return;
      }
      var rst;
      if (isArray$1(elements)) {
          for (var i = 0, len = elements.length; i < len; i++) {
              rst = func(elements[i], i);
              if (rst === false) {
                  break;
              }
          }
      }
      else if (isObject(elements)) {
          for (var k in elements) {
              if (elements.hasOwnProperty(k)) {
                  rst = func(elements[k], k);
                  if (rst === false) {
                      break;
                  }
              }
          }
      }
  }

  var isObjectLike = function (value) {
      /**
       * isObjectLike({}) => true
       * isObjectLike([1, 2, 3]) => true
       * isObjectLike(Function) => false
       * isObjectLike(null) => false
       */
      return typeof value === 'object' && value !== null;
  };

  var toString$1 = {}.toString;
  var isType = function (value, type) { return toString$1.call(value) === '[object ' + type + ']'; };

  var isPlainObject = function (value) {
      /**
       * isObjectLike(new Foo) => false
       * isObjectLike([1, 2, 3]) => false
       * isObjectLike({ x: 0, y: 0 }) => true
       * isObjectLike(Object.create(null)) => true
       */
      if (!isObjectLike(value) || !isType(value, 'Object')) {
          return false;
      }
      if (Object.getPrototypeOf(value) === null) {
          return true;
      }
      var proto = value;
      while (Object.getPrototypeOf(proto) !== null) {
          proto = Object.getPrototypeOf(proto);
      }
      return Object.getPrototypeOf(value) === proto;
  };

  /**
   * 判断值是否为字符串
   * @return 是否为字符串
   */
  function isString(value) {
      return typeof value === 'string';
  }

  /**
   * 判断值是否为数字
   * @return 是否为数字
   */
  function isNumber(value) {
      return typeof value === 'number';
  }

  var clone$1 = function (obj) {
      if (typeof obj !== 'object' || obj === null) {
          return obj;
      }
      var rst;
      if (isArray$1(obj)) {
          rst = [];
          for (var i = 0, l = obj.length; i < l; i++) {
              if (typeof obj[i] === 'object' && obj[i] != null) {
                  rst[i] = clone$1(obj[i]);
              }
              else {
                  rst[i] = obj[i];
              }
          }
      }
      else {
          rst = {};
          for (var k in obj) {
              if (typeof obj[k] === 'object' && obj[k] != null) {
                  rst[k] = clone$1(obj[k]);
              }
              else {
                  rst[k] = obj[k];
              }
          }
      }
      return rst;
  };

  var MAX_MIX_LEVEL = 5;
  function hasOwn(object, property) {
      if (Object.hasOwn) {
          return Object.hasOwn(object, property);
      }
      if (object == null) {
          throw new TypeError('Cannot convert undefined or null to object');
      }
      return Object.prototype.hasOwnProperty.call(Object(object), property);
  }
  function _deepMix(dist, src, level, maxLevel) {
      level = level || 0;
      maxLevel = maxLevel || MAX_MIX_LEVEL;
      for (var key in src) {
          if (hasOwn(src, key)) {
              var value = src[key];
              if (value !== null && isPlainObject(value)) {
                  if (!isPlainObject(dist[key])) {
                      dist[key] = {};
                  }
                  if (level < maxLevel) {
                      _deepMix(dist[key], value, level + 1, maxLevel);
                  }
                  else {
                      dist[key] = src[key];
                  }
              }
              else if (isArray$1(value)) {
                  dist[key] = [];
                  dist[key] = dist[key].concat(value);
              }
              else if (value !== undefined) {
                  dist[key] = value;
              }
          }
      }
  }
  // todo 重写
  var deepMix = function (rst) {
      var args = [];
      for (var _i = 1; _i < arguments.length; _i++) {
          args[_i - 1] = arguments[_i];
      }
      for (var i = 0; i < args.length; i += 1) {
          _deepMix(rst, args[i]);
      }
      return rst;
  };

  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var pick = (function (object, keys) {
      if (object === null || !isPlainObject(object)) {
          return {};
      }
      var result = {};
      each$1(keys, function (key) {
          if (hasOwnProperty.call(object, key)) {
              result[key] = object[key];
          }
      });
      return result;
  });

  const filterOutLinks = (k, v) => {
      if (k !== 'next' && k !== 'prev') {
          return v;
      }
  };
  const unlink = (entry) => {
      entry.prev.next = entry.next;
      entry.next.prev = entry.prev;
      delete entry.next;
      delete entry.prev;
  };
  let List$1 = class List {
      constructor() {
          const shortcut = {};
          shortcut.prev = shortcut;
          shortcut.next = shortcut.prev;
          this.shortcut = shortcut;
      }
      dequeue() {
          const shortcut = this.shortcut;
          const entry = shortcut.prev;
          if (entry && entry !== shortcut) {
              unlink(entry);
              return entry;
          }
      }
      enqueue(entry) {
          const shortcut = this.shortcut;
          if (entry.prev && entry.next) {
              unlink(entry);
          }
          entry.next = shortcut.next;
          shortcut.next.prev = entry;
          shortcut.next = entry;
          entry.prev = shortcut;
      }
      toString() {
          const strs = [];
          const sentinel = this.shortcut;
          let curr = sentinel.prev;
          while (curr !== sentinel) {
              strs.push(JSON.stringify(curr, filterOutLinks));
              curr = curr === null || curr === void 0 ? void 0 : curr.prev;
          }
          return `[${strs.join(', ')}]`;
      }
  };

  /*
   * A greedy heuristic for finding a feedback arc set for a graph. A feedback
   * arc set is a set of edges that can be removed to make a graph acyclic.
   * The algorithm comes from: P. Eades, X. Lin, and W. F. Smyth, "A fast and
   * effective heuristic for the feedback arc set problem." This implementation
   * adjusts that from the paper to allow for weighted edges.
   *
   * @see https://github.com/dagrejs/dagre/blob/master/lib/greedy-fas.js
   */
  class List extends List$1 {
  }
  const DEFAULT_WEIGHT_FN = () => 1;
  const greedyFAS = (g, weightFn) => {
      var _a;
      if (g.getAllNodes().length <= 1)
          return [];
      const state = buildState(g, weightFn || DEFAULT_WEIGHT_FN);
      const results = doGreedyFAS(state.graph, state.buckets, state.zeroIdx);
      return (_a = results
          .map((e) => g.getRelatedEdges(e.v, 'out').filter(({ target }) => target === e.w))) === null || _a === void 0 ? void 0 : _a.flat();
  };
  const doGreedyFAS = (g, buckets, zeroIdx) => {
      let results = [];
      const sources = buckets[buckets.length - 1];
      const sinks = buckets[0];
      let entry;
      while (g.getAllNodes().length) {
          while ((entry = sinks.dequeue())) {
              removeNode(g, buckets, zeroIdx, entry);
          }
          while ((entry = sources.dequeue())) {
              removeNode(g, buckets, zeroIdx, entry);
          }
          if (g.getAllNodes().length) {
              for (let i = buckets.length - 2; i > 0; --i) {
                  entry = buckets[i].dequeue();
                  if (entry) {
                      results = results.concat(removeNode(g, buckets, zeroIdx, entry, true));
                      break;
                  }
              }
          }
      }
      return results;
  };
  const removeNode = (g, buckets, zeroIdx, entry, collectPredecessors) => {
      var _a, _b;
      const results = [];
      if (g.hasNode(entry.v)) {
          (_a = g.getRelatedEdges(entry.v, 'in')) === null || _a === void 0 ? void 0 : _a.forEach((edge) => {
              const weight = edge.data.weight;
              const uEntry = g.getNode(edge.source);
              if (collectPredecessors) {
                  // this result not really care about in or out
                  results.push({ v: edge.source, w: edge.target, in: 0, out: 0 });
              }
              if (uEntry.data.out === undefined)
                  uEntry.data.out = 0;
              // @ts-ignore
              uEntry.data.out -= weight;
              assignBucket(buckets, zeroIdx, Object.assign({ v: uEntry.id }, uEntry.data));
          });
          (_b = g.getRelatedEdges(entry.v, 'out')) === null || _b === void 0 ? void 0 : _b.forEach((edge) => {
              const weight = edge.data.weight;
              const w = edge.target;
              const wEntry = g.getNode(w);
              if (wEntry.data.in === undefined)
                  wEntry.data.in = 0;
              // @ts-ignore
              wEntry.data.in -= weight;
              assignBucket(buckets, zeroIdx, Object.assign({ v: wEntry.id }, wEntry.data));
          });
          g.removeNode(entry.v);
      }
      return collectPredecessors ? results : undefined;
  };
  const buildState = (g, weightFn) => {
      const fasGraph = new Graph();
      let maxIn = 0;
      let maxOut = 0;
      g.getAllNodes().forEach((v) => {
          fasGraph.addNode({
              id: v.id,
              data: { v: v.id, in: 0, out: 0 },
          });
      });
      // Aggregate weights on nodes, but also sum the weights across multi-edges
      // into a single edge for the fasGraph.
      g.getAllEdges().forEach((e) => {
          const edge = fasGraph
              .getRelatedEdges(e.source, 'out')
              .find((edge) => edge.target === e.target);
          const weight = (weightFn === null || weightFn === void 0 ? void 0 : weightFn(e)) || 1;
          if (!edge) {
              fasGraph.addEdge({
                  id: e.id,
                  source: e.source,
                  target: e.target,
                  data: {
                      weight,
                  },
              });
          }
          else {
              fasGraph.updateEdgeData(edge === null || edge === void 0 ? void 0 : edge.id, Object.assign(Object.assign({}, edge.data), { weight: edge.data.weight + weight }));
          }
          // @ts-ignore
          maxOut = Math.max(maxOut, (fasGraph.getNode(e.source).data.out += weight));
          // @ts-ignore
          maxIn = Math.max(maxIn, (fasGraph.getNode(e.target).data.in += weight));
      });
      const buckets = [];
      const rangeMax = maxOut + maxIn + 3;
      for (let i = 0; i < rangeMax; i++) {
          buckets.push(new List());
      }
      const zeroIdx = maxIn + 1;
      fasGraph.getAllNodes().forEach((v) => {
          assignBucket(buckets, zeroIdx, Object.assign({ v: v.id }, fasGraph.getNode(v.id).data));
      });
      return { buckets, zeroIdx, graph: fasGraph };
  };
  const assignBucket = (buckets, zeroIdx, entry) => {
      if (!entry.out) {
          buckets[0].enqueue(entry);
      }
      else if (!entry['in']) {
          buckets[buckets.length - 1].enqueue(entry);
      }
      else {
          buckets[entry.out - entry['in'] + zeroIdx].enqueue(entry);
      }
  };

  const run$2 = (g, acyclicer) => {
      const weightFn = (g) => {
          return (e) => e.data.weight || 1;
      };
      const fas = greedyFAS(g, weightFn()) ;
      fas === null || fas === void 0 ? void 0 : fas.forEach((e) => {
          const label = e.data;
          g.removeEdge(e.id);
          label.forwardName = e.data.name;
          label.reversed = true;
          g.addEdge({
              id: e.id,
              source: e.target,
              target: e.source,
              data: Object.assign({}, label),
          });
      });
  };
  const undo$2 = (g) => {
      g.getAllEdges().forEach((e) => {
          const label = e.data;
          if (label.reversed) {
              g.removeEdge(e.id);
              const forwardName = label.forwardName;
              delete label.reversed;
              delete label.forwardName;
              g.addEdge({
                  id: e.id,
                  source: e.target,
                  target: e.source,
                  data: Object.assign(Object.assign({}, label), { forwardName }),
              });
          }
      });
  };

  const safeSort = (valueA, valueB) => {
      return Number(valueA) - Number(valueB);
  };
  /*
   * Adds a dummy node to the graph and return v.
   */
  const addDummyNode = (g, type, data, name) => {
      let v;
      do {
          v = `${name}${Math.random()}`;
      } while (g.hasNode(v));
      data.dummy = type;
      g.addNode({
          id: v,
          data,
      });
      return v;
  };
  /*
   * Returns a new graph with only simple edges. Handles aggregation of data
   * associated with multi-edges.
   */
  const simplify = (g) => {
      const simplified = new Graph();
      g.getAllNodes().forEach((v) => {
          simplified.addNode(Object.assign({}, v));
      });
      g.getAllEdges().forEach((e) => {
          const edge = simplified
              .getRelatedEdges(e.source, 'out')
              .find((edge) => edge.target === e.target);
          if (!edge) {
              simplified.addEdge({
                  id: e.id,
                  source: e.source,
                  target: e.target,
                  data: {
                      weight: e.data.weight || 0,
                      minlen: e.data.minlen || 1,
                  },
              });
          }
          else {
              simplified.updateEdgeData(edge === null || edge === void 0 ? void 0 : edge.id, Object.assign(Object.assign({}, edge.data), { weight: edge.data.weight + e.data.weight || 0, minlen: Math.max(edge.data.minlen, e.data.minlen || 1) }));
          }
      });
      return simplified;
  };
  const asNonCompoundGraph = (g) => {
      const simplified = new Graph();
      g.getAllNodes().forEach((node) => {
          if (!g.getChildren(node.id).length) {
              simplified.addNode(Object.assign({}, node));
          }
      });
      g.getAllEdges().forEach((edge) => {
          simplified.addEdge(edge);
      });
      return simplified;
  };
  const zipObject = (keys, values) => {
      return keys === null || keys === void 0 ? void 0 : keys.reduce((obj, key, i) => {
          obj[key] = values[i];
          return obj;
      }, {});
  };
  /*
   * Finds where a line starting at point ({x, y}) would intersect a rectangle
   * ({x, y, width, height}) if it were pointing at the rectangle's center.
   */
  const intersectRect = (rect, point) => {
      const x = Number(rect.x);
      const y = Number(rect.y);
      // Rectangle intersection algorithm from:
      // http://math.stackexchange.com/questions/108113/find-edge-between-two-boxes
      const dx = Number(point.x) - x;
      const dy = Number(point.y) - y;
      let w = Number(rect.width) / 2;
      let h = Number(rect.height) / 2;
      if (!dx && !dy) {
          // completely overlapped directly, then return points its self
          return { x: 0, y: 0 };
      }
      let sx;
      let sy;
      if (Math.abs(dy) * w > Math.abs(dx) * h) {
          // Intersection is top or bottom of rect.
          if (dy < 0) {
              h = -h;
          }
          sx = (h * dx) / dy;
          sy = h;
      }
      else {
          // Intersection is left or right of rect.
          if (dx < 0) {
              w = -w;
          }
          sx = w;
          sy = (w * dy) / dx;
      }
      return { x: x + sx, y: y + sy };
  };
  /*
   * Given a DAG with each node assigned "rank" and "order" properties, this
   * const will produce a matrix with the ids of each node.
   */
  const buildLayerMatrix = (g) => {
      const layeringNodes = [];
      const rankMax = maxRank(g) + 1;
      for (let i = 0; i < rankMax; i++) {
          layeringNodes.push([]);
      }
      // const layering = _.map(_.range(maxRank(g) + 1), function() { return []; });
      g.getAllNodes().forEach((node) => {
          const rank = node.data.rank;
          if (rank !== undefined && layeringNodes[rank]) {
              layeringNodes[rank].push(node.id);
          }
      });
      for (let i = 0; i < rankMax; i++) {
          layeringNodes[i] = layeringNodes[i].sort((va, vb) => safeSort(g.getNode(va).data.order, g.getNode(vb).data.order));
      }
      return layeringNodes;
  };
  /*
   * Adjusts the ranks for all nodes in the graph such that all nodes v have
   * rank(v) >= 0 and at least one node w has rank(w) = 0.
   */
  const normalizeRanks = (g) => {
      const nodeRanks = g
          .getAllNodes()
          .filter((v) => v.data.rank !== undefined)
          .map((v) => v.data.rank);
      const min = Math.min(...nodeRanks);
      g.getAllNodes().forEach((v) => {
          if (v.data.hasOwnProperty('rank') && min !== Infinity) {
              v.data.rank -= min;
          }
      });
  };
  const removeEmptyRanks = (g, nodeRankFactor = 0) => {
      // Ranks may not start at 0, so we need to offset them
      const nodes = g.getAllNodes();
      const nodeRanks = nodes
          .filter((v) => v.data.rank !== undefined)
          .map((v) => v.data.rank);
      const offset = Math.min(...nodeRanks);
      const layers = [];
      nodes.forEach((v) => {
          const rank = (v.data.rank || 0) - offset;
          if (!layers[rank]) {
              layers[rank] = [];
          }
          layers[rank].push(v.id);
      });
      let delta = 0;
      for (let i = 0; i < layers.length; i++) {
          const vs = layers[i];
          if (vs === undefined) {
              if (i % nodeRankFactor !== 0) {
                  delta -= 1;
              }
          }
          else if (delta) {
              vs === null || vs === void 0 ? void 0 : vs.forEach((v) => {
                  const node = g.getNode(v);
                  if (node) {
                      node.data.rank = node.data.rank || 0;
                      node.data.rank += delta;
                  }
              });
          }
      }
  };
  const addBorderNode$1 = (g, prefix, rank, order) => {
      const node = {
          width: 0,
          height: 0,
      };
      if (isNumber(rank) && isNumber(order)) {
          node.rank = rank;
          node.order = order;
      }
      return addDummyNode(g, 'border', node, prefix);
  };
  const maxRank = (g) => {
      let maxRank;
      g.getAllNodes().forEach((v) => {
          const rank = v.data.rank;
          if (rank !== undefined) {
              if (maxRank === undefined || rank > maxRank) {
                  maxRank = rank;
              }
          }
      });
      if (!maxRank) {
          maxRank = 0;
      }
      return maxRank;
  };
  /*
   * Partition a collection into two groups: `lhs` and `rhs`. If the supplied
   * const returns true for an entry it goes into `lhs`. Otherwise it goes
   * into `rhs.
   */
  const partition = (collection, fn) => {
      const result = { lhs: [], rhs: [] };
      collection === null || collection === void 0 ? void 0 : collection.forEach((value) => {
          if (fn(value)) {
              result.lhs.push(value);
          }
          else {
              result.rhs.push(value);
          }
      });
      return result;
  };
  const minBy = (array, func) => {
      return array.reduce((a, b) => {
          const valA = func(a);
          const valB = func(b);
          return valA > valB ? b : a;
      });
  };
  const doDFS = (graph, node, postorder, visited, navigator, result) => {
      if (!visited.includes(node.id)) {
          visited.push(node.id);
          if (!postorder) {
              result.push(node.id);
          }
          navigator(node.id).forEach((n) => doDFS(graph, n, postorder, visited, navigator, result));
          if (postorder) {
              result.push(node.id);
          }
      }
  };
  /**
   * @description DFS traversal.
   * @description.zh-CN DFS 遍历。
   */
  const dfs$1 = (graph, node, order, isDirected) => {
      const nodes = Array.isArray(node) ? node : [node];
      const navigator = (n) => (graph.getNeighbors(n));
      const results = [];
      const visited = [];
      nodes.forEach((node) => {
          if (!graph.hasNode(node.id)) {
              throw new Error(`Graph does not have node: ${node}`);
          }
          else {
              doDFS(graph, node, order === 'post', visited, navigator, results);
          }
      });
      return results;
  };

  const addBorderSegments = (g) => {
      const dfs = (v) => {
          const children = g.getChildren(v);
          const node = g.getNode(v);
          if (children === null || children === void 0 ? void 0 : children.length) {
              children.forEach((child) => dfs(child.id));
          }
          if (node.data.hasOwnProperty('minRank')) {
              node.data.borderLeft = [];
              node.data.borderRight = [];
              for (let rank = node.data.minRank, maxRank = node.data.maxRank + 1; rank < maxRank; rank += 1) {
                  addBorderNode(g, 'borderLeft', '_bl', v, node, rank);
                  addBorderNode(g, 'borderRight', '_br', v, node, rank);
              }
          }
      };
      g.getRoots().forEach((child) => dfs(child.id));
  };
  const addBorderNode = (g, prop, prefix, sg, sgNode, rank) => {
      const label = { rank, borderType: prop, width: 0, height: 0 };
      // @ts-ignore
      const prev = sgNode.data[prop][rank - 1];
      const curr = addDummyNode(g, 'border', label, prefix);
      // @ts-ignore
      sgNode.data[prop][rank] = curr;
      g.setParent(curr, sg);
      if (prev) {
          g.addEdge({
              id: `e${Math.random()}`,
              source: prev,
              target: curr,
              data: { weight: 1 },
          });
      }
  };

  const adjust = (g, rankdir) => {
      const rd = rankdir.toLowerCase();
      if (rd === 'lr' || rd === 'rl') {
          swapWidthHeight(g);
      }
  };
  const undo$1 = (g, rankdir) => {
      const rd = rankdir.toLowerCase();
      if (rd === 'bt' || rd === 'rl') {
          reverseY(g);
      }
      if (rd === 'lr' || rd === 'rl') {
          swapXY(g);
          swapWidthHeight(g);
      }
  };
  const swapWidthHeight = (g) => {
      g.getAllNodes().forEach((v) => {
          swapWidthHeightOne(v);
      });
      g.getAllEdges().forEach((e) => {
          swapWidthHeightOne(e);
      });
  };
  const swapWidthHeightOne = (node) => {
      const w = node.data.width;
      node.data.width = node.data.height;
      node.data.height = w;
  };
  const reverseY = (g) => {
      g.getAllNodes().forEach((v) => {
          reverseYOne(v.data);
      });
      g.getAllEdges().forEach((edge) => {
          var _a;
          (_a = edge.data.points) === null || _a === void 0 ? void 0 : _a.forEach((point) => reverseYOne(point));
          if (edge.data.hasOwnProperty('y')) {
              reverseYOne(edge.data);
          }
      });
  };
  const reverseYOne = (node) => {
      if (node === null || node === void 0 ? void 0 : node.y) {
          node.y = -node.y;
      }
  };
  const swapXY = (g) => {
      g.getAllNodes().forEach((v) => {
          swapXYOne(v.data);
      });
      g.getAllEdges().forEach((edge) => {
          var _a;
          (_a = edge.data.points) === null || _a === void 0 ? void 0 : _a.forEach((point) => swapXYOne(point));
          if (edge.data.hasOwnProperty('x')) {
              swapXYOne(edge.data);
          }
      });
  };
  const swapXYOne = (node) => {
      const x = node.x;
      node.x = node.y;
      node.y = x;
  };

  /*
   * A nesting graph creates dummy nodes for the tops and bottoms of subgraphs,
   * adds appropriate edges to ensure that all cluster nodes are placed between
   * these boundries, and ensures that the graph is connected.
   *
   * In addition we ensure, through the use of the minlen property, that nodes
   * and subgraph border nodes to not end up on the same rank.
   *
   * Preconditions:
   *
   *    1. Input graph is a DAG
   *    2. Nodes in the input graph has a minlen attribute
   *
   * Postconditions:
   *
   *    1. Input graph is connected.
   *    2. Dummy nodes are added for the tops and bottoms of subgraphs.
   *    3. The minlen attribute for nodes is adjusted to ensure nodes do not
   *       get placed on the same rank as subgraph border nodes.
   *
   * The nesting graph idea comes from Sander, "Layout of Compound Directed
   * Graphs."
   */
  const run$1 = (g) => {
      const root = addDummyNode(g, 'root', {}, '_root');
      const depths = treeDepths(g);
      let maxDepth = Math.max(...Object.values(depths));
      if (Math.abs(maxDepth) === Infinity) {
          maxDepth = 1;
      }
      const height = maxDepth - 1; // Note: depths is an Object not an array
      const nodeSep = 2 * height + 1;
      // g.graph().nestingRoot = root;
      // Multiply minlen by nodeSep to align nodes on non-border ranks.
      g.getAllEdges().forEach((e) => {
          e.data.minlen *= nodeSep;
      });
      // Calculate a weight that is sufficient to keep subgraphs vertically compact
      const weight = sumWeights(g) + 1;
      // Create border nodes and link them up
      // g.children()?.forEach((child) => {
      //   dfs(g, root, nodeSep, weight, height, depths, child);
      // });
      g.getRoots().forEach((child) => {
          dfs(g, root, nodeSep, weight, height, depths, child.id);
      });
      // Save the multiplier for node layers for later removal of empty border
      // layers.
      // g.graph().nodeRankFactor = nodeSep;
      return {
          nestingRoot: root,
          nodeRankFactor: nodeSep,
      };
  };
  const dfs = (g, root, nodeSep, weight, height, depths, v) => {
      const children = g.getChildren(v);
      if (!(children === null || children === void 0 ? void 0 : children.length)) {
          if (v !== root) {
              // g.setEdge(root, v, { weight: 0, minlen: nodeSep });
              g.addEdge({
                  id: `e${Math.random()}`,
                  source: root,
                  target: v,
                  data: { weight: 0, minlen: nodeSep },
              });
          }
          return;
      }
      const top = addBorderNode$1(g, '_bt');
      const bottom = addBorderNode$1(g, '_bb');
      const label = g.getNode(v);
      g.setParent(top, v);
      label.data.borderTop = top;
      g.setParent(bottom, v);
      label.data.borderBottom = bottom;
      children === null || children === void 0 ? void 0 : children.forEach((childNode) => {
          dfs(g, root, nodeSep, weight, height, depths, childNode.id);
          const childTop = childNode.data.borderTop
              ? childNode.data.borderTop
              : childNode.id;
          const childBottom = childNode.data.borderBottom
              ? childNode.data.borderBottom
              : childNode.id;
          const thisWeight = childNode.data.borderTop ? weight : 2 * weight;
          const minlen = childTop !== childBottom ? 1 : height - depths[v] + 1;
          g.addEdge({
              id: `e${Math.random()}`,
              source: top,
              target: childTop,
              data: {
                  minlen,
                  weight: thisWeight,
                  nestingEdge: true,
              },
          });
          g.addEdge({
              id: `e${Math.random()}`,
              source: childBottom,
              target: bottom,
              data: {
                  minlen,
                  weight: thisWeight,
                  nestingEdge: true,
              },
          });
      });
      if (!g.getParent(v)) {
          g.addEdge({
              id: `e${Math.random()}`,
              source: root,
              target: top,
              data: {
                  weight: 0,
                  minlen: height + depths[v],
              },
          });
      }
  };
  const treeDepths = (g) => {
      const depths = {};
      const dfs = (v, depth) => {
          const children = g.getChildren(v);
          children === null || children === void 0 ? void 0 : children.forEach((child) => dfs(child.id, depth + 1));
          depths[v] = depth;
      };
      // g.children()?.forEach((v) => dfs(v, 1));
      g.getRoots().forEach((v) => dfs(v.id, 1));
      return depths;
  };
  const sumWeights = (g) => {
      let result = 0;
      g.getAllEdges().forEach((e) => {
          result += e.data.weight;
      });
      return result;
  };
  const cleanup = (g, nestingRoot) => {
      // const graphLabel = g.graph();
      // graphLabel.nestingRoot && g.removeNode(graphLabel.nestingRoot);
      // delete graphLabel.nestingRoot;
      if (nestingRoot) {
          g.removeNode(nestingRoot);
      }
      g.getAllEdges().forEach((e) => {
          if (e.data.nestingEdge) {
              g.removeEdge(e.id);
          }
      });
  };

  /*
   * Breaks any long edges in the graph into short segments that span 1 layer
   * each. This operation is undoable with the denormalize function.
   *
   * Pre-conditions:
   *
   *    1. The input graph is a DAG.
   *    2. Each node in the graph has a "rank" property.
   *
   * Post-condition:
   *
   *    1. All edges in the graph have a length of 1.
   *    2. Dummy nodes are added where edges have been split into segments.
   *    3. The graph is augmented with a "dummyChains" attribute which contains
   *       the first dummy in each chain of dummy nodes produced.
   */
  const DUMMY_NODE_EDGE = 'edge';
  const DUMMY_NODE_EDGE_LABEL = 'edge-label';
  const run = (g, dummyChains) => {
      g.getAllEdges().forEach((edge) => normalizeEdge(g, edge, dummyChains));
  };
  const normalizeEdge = (g, e, dummyChains) => {
      let v = e.source;
      let vRank = g.getNode(v).data.rank;
      const w = e.target;
      const wRank = g.getNode(w).data.rank;
      const labelRank = e.data.labelRank;
      if (wRank === vRank + 1)
          return;
      g.removeEdge(e.id);
      let dummy;
      let nodeData;
      let i;
      for (i = 0, ++vRank; vRank < wRank; ++i, ++vRank) {
          e.data.points = [];
          nodeData = {
              originalEdge: e,
              width: 0,
              height: 0,
              rank: vRank,
          };
          dummy = addDummyNode(g, DUMMY_NODE_EDGE, nodeData, '_d');
          if (vRank === labelRank) {
              nodeData.width = e.data.width;
              nodeData.height = e.data.height;
              nodeData.dummy = DUMMY_NODE_EDGE_LABEL;
              nodeData.labelpos = e.data.labelpos;
          }
          g.addEdge({
              id: `e${Math.random()}`,
              source: v,
              target: dummy,
              data: { weight: e.data.weight },
          });
          if (i === 0) {
              dummyChains.push(dummy);
          }
          v = dummy;
      }
      g.addEdge({
          id: `e${Math.random()}`,
          source: v,
          target: w,
          data: { weight: e.data.weight },
      });
  };
  const undo = (g, dummyChains) => {
      dummyChains.forEach((v) => {
          let node = g.getNode(v);
          const { data } = node;
          const originalEdge = data.originalEdge;
          let w;
          // Restore original edge.
          if (originalEdge) {
              g.addEdge(originalEdge);
          }
          let currentV = v;
          while (node.data.dummy) {
              w = g.getSuccessors(currentV)[0];
              g.removeNode(currentV);
              originalEdge.data.points.push({
                  x: node.data.x,
                  y: node.data.y,
              });
              if (node.data.dummy === DUMMY_NODE_EDGE_LABEL) {
                  originalEdge.data.x = node.data.x;
                  originalEdge.data.y = node.data.y;
                  originalEdge.data.width = node.data.width;
                  originalEdge.data.height = node.data.height;
              }
              currentV = w.id;
              node = g.getNode(currentV);
          }
      });
  };

  const addSubgraphConstraints = (g, cg, vs) => {
      const prev = {};
      let rootPrev;
      vs === null || vs === void 0 ? void 0 : vs.forEach((v) => {
          let child = g.getParent(v);
          let parent;
          let prevChild;
          while (child) {
              parent = g.getParent(child.id);
              if (parent) {
                  prevChild = prev[parent.id];
                  prev[parent.id] = child.id;
              }
              else {
                  prevChild = rootPrev;
                  rootPrev = child.id;
              }
              if (prevChild && prevChild !== child.id) {
                  if (!cg.hasNode(prevChild)) {
                      cg.addNode({
                          id: prevChild,
                          data: {},
                      });
                  }
                  if (!cg.hasNode(child.id)) {
                      cg.addNode({
                          id: child.id,
                          data: {},
                      });
                  }
                  if (!cg.hasEdge(`e${prevChild}-${child.id}`)) {
                      cg.addEdge({
                          id: `e${prevChild}-${child.id}`,
                          source: prevChild,
                          target: child.id,
                          data: {},
                      });
                  }
                  return;
              }
              child = parent;
          }
      });
  };

  /*
   * Constructs a graph that can be used to sort a layer of nodes. The graph will
   * contain all base and subgraph nodes from the request layer in their original
   * hierarchy and any edges that are incident on these nodes and are of the type
   * requested by the "relationship" parameter.
   *
   * Nodes from the requested rank that do not have parents are assigned a root
   * node in the output graph, which is set in the root graph attribute. This
   * makes it easy to walk the hierarchy of movable nodes during ordering.
   *
   * Pre-conditions:
   *
   *    1. Input graph is a DAG
   *    2. Base nodes in the input graph have a rank attribute
   *    3. Subgraph nodes in the input graph has minRank and maxRank attributes
   *    4. Edges have an assigned weight
   *
   * Post-conditions:
   *
   *    1. Output graph has all nodes in the movable rank with preserved
   *       hierarchy.
   *    2. Root nodes in the movable layer are made children of the node
   *       indicated by the root attribute of the graph.
   *    3. Non-movable nodes incident on movable nodes, selected by the
   *       relationship parameter, are included in the graph (without hierarchy).
   *    4. Edges incident on movable nodes, selected by the relationship
   *       parameter, are added to the output graph.
   *    5. The weights for copied edges are aggregated as need, since the output
   *       graph is not a multi-graph.
   */
  const buildLayerGraph = (g, rank, direction) => {
      const root = createRootNode(g);
      const result = new Graph({
          tree: [
              {
                  id: root,
                  children: [],
                  data: {},
              },
          ],
      });
      g.getAllNodes().forEach((v) => {
          const parent = g.getParent(v.id);
          if (v.data.rank === rank ||
              (v.data.minRank <= rank && rank <= v.data.maxRank)) {
              if (!result.hasNode(v.id)) {
                  result.addNode(Object.assign({}, v));
              }
              if ((parent === null || parent === void 0 ? void 0 : parent.id) && !result.hasNode(parent === null || parent === void 0 ? void 0 : parent.id)) {
                  result.addNode(Object.assign({}, parent));
              }
              result.setParent(v.id, (parent === null || parent === void 0 ? void 0 : parent.id) || root);
              // This assumes we have only short edges!
              g.getRelatedEdges(v.id, direction).forEach((e) => {
                  const u = e.source === v.id ? e.target : e.source;
                  if (!result.hasNode(u)) {
                      result.addNode(Object.assign({}, g.getNode(u)));
                  }
                  const edge = result
                      .getRelatedEdges(u, 'out')
                      .find(({ target }) => target === v.id);
                  const weight = edge !== undefined ? edge.data.weight : 0;
                  if (!edge) {
                      result.addEdge({
                          id: e.id,
                          source: u,
                          target: v.id,
                          data: {
                              weight: e.data.weight + weight,
                          },
                      });
                  }
                  else {
                      result.updateEdgeData(edge.id, Object.assign(Object.assign({}, edge.data), { weight: e.data.weight + weight }));
                  }
              });
              // console.log(v);
              if (v.data.hasOwnProperty('minRank')) {
                  result.updateNodeData(v.id, Object.assign(Object.assign({}, v.data), { borderLeft: v.data.borderLeft[rank], borderRight: v.data.borderRight[rank] }));
              }
          }
      });
      return result;
  };
  const createRootNode = (g) => {
      let v;
      while (g.hasNode((v = `_root${Math.random()}`)))
          ;
      return v;
  };

  /*
   * A function that takes a layering (an array of layers, each with an array of
   * ordererd nodes) and a graph and returns a weighted crossing count.
   *
   * Pre-conditions:
   *
   *    1. Input graph must be simple (not a multigraph), directed, and include
   *       only simple edges.
   *    2. Edges in the input graph must have assigned weights.
   *
   * Post-conditions:
   *
   *    1. The graph and layering matrix are left unchanged.
   *
   * This algorithm is derived from Barth, et al., "Bilayer Cross Counting."
   */
  const twoLayerCrossCount = (g, northLayer, southLayer) => {
      // Sort all of the edges between the north and south layers by their position
      // in the north layer and then the south. Map these edges to the position of
      // their head in the south layer.
      const southPos = zipObject(southLayer, southLayer.map((v, i) => i));
      const unflat = northLayer.map((v) => {
          const unsort = g.getRelatedEdges(v, 'out').map((e) => {
              return { pos: southPos[e.target] || 0, weight: e.data.weight };
          });
          return unsort === null || unsort === void 0 ? void 0 : unsort.sort((a, b) => a.pos - b.pos);
      });
      const southEntries = unflat.flat().filter((entry) => entry !== undefined);
      // Build the accumulator tree
      let firstIndex = 1;
      while (firstIndex < southLayer.length)
          firstIndex <<= 1;
      const treeSize = 2 * firstIndex - 1;
      firstIndex -= 1;
      const tree = Array(treeSize).fill(0, 0, treeSize);
      // Calculate the weighted crossings
      let cc = 0;
      southEntries === null || southEntries === void 0 ? void 0 : southEntries.forEach((entry) => {
          if (entry) {
              let index = entry.pos + firstIndex;
              tree[index] += entry.weight;
              let weightSum = 0;
              while (index > 0) {
                  if (index % 2) {
                      weightSum += tree[index + 1];
                  }
                  index = (index - 1) >> 1;
                  tree[index] += entry.weight;
              }
              cc += entry.weight * weightSum;
          }
      });
      return cc;
  };
  const crossCount = (g, layering) => {
      let cc = 0;
      for (let i = 1; i < (layering === null || layering === void 0 ? void 0 : layering.length); i += 1) {
          cc += twoLayerCrossCount(g, layering[i - 1], layering[i]);
      }
      return cc;
  };

  /*
   * Assigns an initial order value for each node by performing a DFS search
   * starting from nodes in the first rank. Nodes are assigned an order in their
   * rank as they are first visited.
   *
   * This approach comes from Gansner, et al., "A Technique for Drawing Directed
   * Graphs."
   *
   * Returns a layering matrix with an array per layer and each layer sorted by
   * the order of its nodes.
   */
  const initOrder = (g) => {
      const visited = {};
      // const simpleNodes = g.getAllNodes().filter((v) => {
      //   return !g.getChildren(v.id)?.length;
      // });
      const simpleNodes = g.getAllNodes();
      const nodeRanks = simpleNodes.map((v) => { var _a; return (_a = v.data.rank) !== null && _a !== void 0 ? _a : -Infinity; });
      const maxRank = Math.max(...nodeRanks);
      const layers = [];
      for (let i = 0; i < maxRank + 1; i++) {
          layers.push([]);
      }
      const orderedVs = simpleNodes.sort((a, b) => g.getNode(a.id).data.rank - g.getNode(b.id).data.rank);
      // const orderedVs = _.sortBy(simpleNodes, function(v) { return g.node(v)!.rank; });
      // 有fixOrder的，直接排序好放进去
      const beforeSort = orderedVs.filter((n) => {
          return g.getNode(n.id).data.fixorder !== undefined;
      });
      const fixOrderNodes = beforeSort.sort((a, b) => g.getNode(a.id).data.fixorder - g.getNode(b.id).data.fixorder);
      fixOrderNodes === null || fixOrderNodes === void 0 ? void 0 : fixOrderNodes.forEach((n) => {
          if (!isNaN(g.getNode(n.id).data.rank)) {
              layers[g.getNode(n.id).data.rank].push(n.id);
          }
          visited[n.id] = true;
      });
      orderedVs === null || orderedVs === void 0 ? void 0 : orderedVs.forEach((n) => g.dfsTree(n.id, (node) => {
          if (visited.hasOwnProperty(node.id))
              return true;
          visited[node.id] = true;
          if (!isNaN(node.data.rank)) {
              layers[node.data.rank].push(node.id);
          }
      }));
      return layers;
  };

  /**
   * TODO: The median method consistently performs better than the barycenter method and has a slight theoretical advantage
   */
  const barycenter = (g, movable) => {
      return movable.map((v) => {
          const inV = g.getRelatedEdges(v, 'in');
          if (!(inV === null || inV === void 0 ? void 0 : inV.length)) {
              return { v };
          }
          const result = { sum: 0, weight: 0 };
          inV === null || inV === void 0 ? void 0 : inV.forEach((e) => {
              const nodeU = g.getNode(e.source);
              result.sum += e.data.weight * nodeU.data.order;
              result.weight += e.data.weight;
          });
          return {
              v,
              barycenter: result.sum / result.weight,
              weight: result.weight,
          };
      });
  };

  /*
   * Given a list of entries of the form {v, barycenter, weight} and a
   * constraint graph this function will resolve any conflicts between the
   * constraint graph and the barycenters for the entries. If the barycenters for
   * an entry would violate a constraint in the constraint graph then we coalesce
   * the nodes in the conflict into a new node that respects the contraint and
   * aggregates barycenter and weight information.
   *
   * This implementation is based on the description in Forster, "A Fast and
   * Simple Hueristic for Constrained Two-Level Crossing Reduction," thought it
   * differs in some specific details.
   *
   * Pre-conditions:
   *
   *    1. Each entry has the form {v, barycenter, weight}, or if the node has
   *       no barycenter, then {v}.
   *
   * Returns:
   *
   *    A new list of entries of the form {vs, i, barycenter, weight}. The list
   *    `vs` may either be a singleton or it may be an aggregation of nodes
   *    ordered such that they do not violate constraints from the constraint
   *    graph. The property `i` is the lowest original index of any of the
   *    elements in `vs`.
   */
  const resolveConflicts = (entries, cg) => {
      var _a, _b, _c;
      const mappedEntries = {};
      entries === null || entries === void 0 ? void 0 : entries.forEach((entry, i) => {
          mappedEntries[entry.v] = {
              i,
              indegree: 0,
              in: [],
              out: [],
              vs: [entry.v],
          };
          const tmp = mappedEntries[entry.v];
          if (entry.barycenter !== undefined) {
              tmp.barycenter = entry.barycenter;
              tmp.weight = entry.weight;
          }
      });
      (_a = cg.getAllEdges()) === null || _a === void 0 ? void 0 : _a.forEach((e) => {
          const entryV = mappedEntries[e.source];
          const entryW = mappedEntries[e.target];
          if (entryV !== undefined && entryW !== undefined) {
              entryW.indegree++;
              entryV.out.push(mappedEntries[e.target]);
          }
      });
      const sourceSet = (_c = (_b = Object.values(mappedEntries)).filter) === null || _c === void 0 ? void 0 : _c.call(_b, (entry) => !entry.indegree);
      return doResolveConflicts(sourceSet);
  };
  const doResolveConflicts = (sourceSet) => {
      var _a, _b;
      const entries = [];
      const handleIn = (vEntry) => {
          return (uEntry) => {
              if (uEntry.merged)
                  return;
              if (uEntry.barycenter === undefined ||
                  vEntry.barycenter === undefined ||
                  uEntry.barycenter >= vEntry.barycenter) {
                  mergeEntries(vEntry, uEntry);
              }
          };
      };
      const handleOut = (vEntry) => {
          return (wEntry) => {
              wEntry['in'].push(vEntry);
              if (--wEntry.indegree === 0) {
                  sourceSet.push(wEntry);
              }
          };
      };
      while (sourceSet === null || sourceSet === void 0 ? void 0 : sourceSet.length) {
          const entry = sourceSet.pop();
          entries.push(entry);
          (_a = entry['in'].reverse()) === null || _a === void 0 ? void 0 : _a.forEach((e) => handleIn(entry)(e));
          (_b = entry.out) === null || _b === void 0 ? void 0 : _b.forEach((e) => handleOut(entry)(e));
      }
      const filtered = entries.filter((entry) => !entry.merged);
      const keys = [
          'vs',
          'i',
          'barycenter',
          'weight',
      ];
      return filtered.map((entry) => {
          const picked = {};
          keys === null || keys === void 0 ? void 0 : keys.forEach((key) => {
              if (entry[key] === undefined)
                  return;
              picked[key] = entry[key];
          });
          return picked;
      });
  };
  const mergeEntries = (target, source) => {
      var _a;
      let sum = 0;
      let weight = 0;
      if (target.weight) {
          sum += target.barycenter * target.weight;
          weight += target.weight;
      }
      if (source.weight) {
          sum += source.barycenter * source.weight;
          weight += source.weight;
      }
      target.vs = (_a = source.vs) === null || _a === void 0 ? void 0 : _a.concat(target.vs);
      target.barycenter = sum / weight;
      target.weight = weight;
      target.i = Math.min(source.i, target.i);
      source.merged = true;
  };

  const sort = (entries, biasRight, usePrev, keepNodeOrder) => {
      const parts = partition(entries, (entry) => {
          const hasFixOrder = entry.hasOwnProperty('fixorder') && !isNaN(entry.fixorder);
          if (keepNodeOrder) {
              return !hasFixOrder && entry.hasOwnProperty('barycenter');
          }
          // NOTE: 有fixorder的也可以排
          return hasFixOrder || entry.hasOwnProperty('barycenter');
      });
      const sortable = parts.lhs;
      const unsortable = parts.rhs.sort((a, b) => -a.i - -b.i);
      const vs = [];
      let sum = 0;
      let weight = 0;
      let vsIndex = 0;
      sortable === null || sortable === void 0 ? void 0 : sortable.sort(compareWithBias(!!biasRight, !!usePrev));
      vsIndex = consumeUnsortable(vs, unsortable, vsIndex);
      sortable === null || sortable === void 0 ? void 0 : sortable.forEach((entry) => {
          var _a;
          vsIndex += (_a = entry.vs) === null || _a === void 0 ? void 0 : _a.length;
          vs.push(entry.vs);
          sum += entry.barycenter * entry.weight;
          weight += entry.weight;
          vsIndex = consumeUnsortable(vs, unsortable, vsIndex);
      });
      const result = {
          vs: vs.flat(),
      };
      if (weight) {
          result.barycenter = sum / weight;
          result.weight = weight;
      }
      return result;
  };
  const consumeUnsortable = (vs, unsortable, index) => {
      let iindex = index;
      let last;
      while (unsortable.length &&
          (last = unsortable[unsortable.length - 1]).i <= iindex) {
          unsortable.pop();
          vs === null || vs === void 0 ? void 0 : vs.push(last.vs);
          iindex++;
      }
      return iindex;
  };
  /**
   * 配置是否考虑使用之前的布局结果
   */
  const compareWithBias = (bias, usePrev) => {
      return (entryV, entryW) => {
          // 排序的时候先判断fixorder，不行再判断重心
          if (entryV.fixorder !== undefined && entryW.fixorder !== undefined) {
              return entryV.fixorder - entryW.fixorder;
          }
          if (entryV.barycenter < entryW.barycenter) {
              return -1;
          }
          if (entryV.barycenter > entryW.barycenter) {
              return 1;
          }
          // 重心相同，考虑之前排好的顺序
          if (usePrev && entryV.order !== undefined && entryW.order !== undefined) {
              if (entryV.order < entryW.order) {
                  return -1;
              }
              if (entryV.order > entryW.order) {
                  return 1;
              }
          }
          return !bias ? entryV.i - entryW.i : entryW.i - entryV.i;
      };
  };

  const sortSubgraph = (g, v, cg, biasRight, usePrev, keepNodeOrder) => {
      var _a, _b, _c, _d;
      let movable = g.getChildren(v).map((n) => n.id);
      // fixorder的点不参与排序（这个方案不合适，只排了新增节点，和原来的分离）
      const node = g.getNode(v);
      const bl = node ? node.data.borderLeft : undefined;
      const br = node ? node.data.borderRight : undefined;
      const subgraphs = {};
      if (bl) {
          movable = movable === null || movable === void 0 ? void 0 : movable.filter((w) => {
              return w !== bl && w !== br;
          });
      }
      const barycenters = barycenter(g, movable || []);
      barycenters === null || barycenters === void 0 ? void 0 : barycenters.forEach((entry) => {
          var _a;
          if ((_a = g.getChildren(entry.v)) === null || _a === void 0 ? void 0 : _a.length) {
              const subgraphResult = sortSubgraph(g, entry.v, cg, biasRight, keepNodeOrder);
              subgraphs[entry.v] = subgraphResult;
              if (subgraphResult.hasOwnProperty('barycenter')) {
                  mergeBarycenters(entry, subgraphResult);
              }
          }
      });
      const entries = resolveConflicts(barycenters, cg);
      expandSubgraphs(entries, subgraphs);
      // 添加fixorder信息到entries里边
      // TODO: 不考虑复合情况，只用第一个点的fixorder信息，后续考虑更完备的实现
      (_a = entries
          .filter((e) => e.vs.length > 0)) === null || _a === void 0 ? void 0 : _a.forEach((e) => {
          const node = g.getNode(e.vs[0]);
          if (node) {
              e.fixorder = node.data.fixorder;
              e.order = node.data.order;
          }
      });
      const result = sort(entries, biasRight, usePrev, keepNodeOrder);
      if (bl) {
          result.vs = [bl, result.vs, br].flat();
          if ((_b = g.getPredecessors(bl)) === null || _b === void 0 ? void 0 : _b.length) {
              const blPred = g.getNode(((_c = g.getPredecessors(bl)) === null || _c === void 0 ? void 0 : _c[0].id) || '');
              const brPred = g.getNode(((_d = g.getPredecessors(br)) === null || _d === void 0 ? void 0 : _d[0].id) || '');
              if (!result.hasOwnProperty('barycenter')) {
                  result.barycenter = 0;
                  result.weight = 0;
              }
              result.barycenter =
                  (result.barycenter * result.weight +
                      blPred.data.order +
                      brPred.data.order) /
                      (result.weight + 2);
              result.weight += 2;
          }
      }
      return result;
  };
  const expandSubgraphs = (entries, subgraphs) => {
      entries === null || entries === void 0 ? void 0 : entries.forEach((entry) => {
          var _a;
          const vss = (_a = entry.vs) === null || _a === void 0 ? void 0 : _a.map((v) => {
              if (subgraphs[v]) {
                  return subgraphs[v].vs;
              }
              return v;
          });
          entry.vs = vss.flat();
      });
  };
  const mergeBarycenters = (target, other) => {
      if (target.barycenter !== undefined) {
          target.barycenter =
              (target.barycenter * target.weight + other.barycenter * other.weight) /
                  (target.weight + other.weight);
          target.weight += other.weight;
      }
      else {
          target.barycenter = other.barycenter;
          target.weight = other.weight;
      }
  };

  /*
   * Applies heuristics to minimize edge crossings in the graph and sets the best
   * order solution as an order attribute on each node.
   *
   * Pre-conditions:
   *
   *    1. Graph must be DAG
   *    2. Graph nodes must be objects with a "rank" attribute
   *    3. Graph edges must have the "weight" attribute
   *
   * Post-conditions:
   *
   *    1. Graph nodes will have an "order" attribute based on the results of the
   *       algorithm.
   */
  const order = (g, keepNodeOrder) => {
      const mxRank = maxRank(g);
      const range1 = [];
      const range2 = [];
      for (let i = 1; i < mxRank + 1; i++)
          range1.push(i);
      for (let i = mxRank - 1; i > -1; i--)
          range2.push(i);
      const downLayerGraphs = buildLayerGraphs(g, range1, 'in');
      const upLayerGraphs = buildLayerGraphs(g, range2, 'out');
      let layering = initOrder(g);
      assignOrder(g, layering);
      let bestCC = Number.POSITIVE_INFINITY;
      let best;
      for (let i = 0, lastBest = 0; lastBest < 4; ++i, ++lastBest) {
          sweepLayerGraphs(i % 2 ? downLayerGraphs : upLayerGraphs, i % 4 >= 2, false, keepNodeOrder);
          layering = buildLayerMatrix(g);
          const cc = crossCount(g, layering);
          if (cc < bestCC) {
              lastBest = 0;
              best = clone$1(layering);
              bestCC = cc;
          }
      }
      // consider use previous result, maybe somewhat reduendant
      layering = initOrder(g);
      assignOrder(g, layering);
      for (let i = 0, lastBest = 0; lastBest < 4; ++i, ++lastBest) {
          sweepLayerGraphs(i % 2 ? downLayerGraphs : upLayerGraphs, i % 4 >= 2, true, keepNodeOrder);
          layering = buildLayerMatrix(g);
          const cc = crossCount(g, layering);
          if (cc < bestCC) {
              lastBest = 0;
              best = clone$1(layering);
              bestCC = cc;
          }
      }
      assignOrder(g, best);
  };
  const buildLayerGraphs = (g, ranks, direction) => {
      return ranks.map((rank) => {
          return buildLayerGraph(g, rank, direction);
      });
  };
  const sweepLayerGraphs = (layerGraphs, biasRight, usePrev, keepNodeOrder) => {
      const cg = new Graph();
      layerGraphs === null || layerGraphs === void 0 ? void 0 : layerGraphs.forEach((lg) => {
          var _a;
          // const root = lg.graph().root as string;
          const root = lg.getRoots()[0].id;
          const sorted = sortSubgraph(lg, root, cg, biasRight, usePrev, keepNodeOrder);
          for (let i = 0; i < ((_a = sorted.vs) === null || _a === void 0 ? void 0 : _a.length) || 0; i++) {
              const lnode = lg.getNode(sorted.vs[i]);
              if (lnode) {
                  lnode.data.order = i;
              }
          }
          addSubgraphConstraints(lg, cg, sorted.vs);
      });
  };
  const assignOrder = (g, layering) => {
      layering === null || layering === void 0 ? void 0 : layering.forEach((layer) => {
          layer === null || layer === void 0 ? void 0 : layer.forEach((v, i) => {
              g.getNode(v).data.order = i;
          });
      });
  };

  /**
   * 按照数据中的结果设置fixorder
   */
  const initDataOrder = (g, nodeOrder) => {
      const simpleNodes = g.getAllNodes().filter((v) => {
          var _a;
          return !((_a = g.getChildren(v.id)) === null || _a === void 0 ? void 0 : _a.length);
      });
      const ranks = simpleNodes.map((v) => v.data.rank);
      const maxRank = Math.max(...ranks);
      const layers = [];
      for (let i = 0; i < maxRank + 1; i++) {
          layers[i] = [];
      }
      nodeOrder === null || nodeOrder === void 0 ? void 0 : nodeOrder.forEach((n) => {
          const node = g.getNode(n);
          // 只考虑原有节点，dummy节点需要按照后续算法排出
          if (!node || node.data.dummy) {
              return;
          }
          if (!isNaN(node.data.rank)) {
              node.data.fixorder = layers[node.data.rank].length; // 设置fixorder为当层的顺序
              layers[node.data.rank].push(n);
          }
      });
  };

  // deep first search with both order low for pre, lim for post
  const dfsBothOrder = (g) => {
      const result = {};
      let lim = 0;
      const dfs = (v) => {
          const low = lim;
          g.getChildren(v).forEach((n) => dfs(n.id));
          result[v] = { low, lim: lim++ };
      };
      g.getRoots().forEach((n) => dfs(n.id));
      return result;
  };
  // Find a path from v to w through the lowest common ancestor (LCA). Return the
  // full path and the LCA.
  const findPath = (g, postorderNums, v, w) => {
      var _a, _b;
      const vPath = [];
      const wPath = [];
      const low = Math.min(postorderNums[v].low, postorderNums[w].low);
      const lim = Math.max(postorderNums[v].lim, postorderNums[w].lim);
      let parent;
      let lca;
      // Traverse up from v to find the LCA
      parent = v;
      do {
          parent = (_a = g.getParent(parent)) === null || _a === void 0 ? void 0 : _a.id;
          vPath.push(parent);
      } while (parent &&
          (postorderNums[parent].low > low || lim > postorderNums[parent].lim));
      lca = parent;
      // Traverse from w to LCA
      parent = w;
      while (parent && parent !== lca) {
          wPath.push(parent);
          parent = (_b = g.getParent(parent)) === null || _b === void 0 ? void 0 : _b.id;
      }
      return { lca, path: vPath.concat(wPath.reverse()) };
  };
  const parentDummyChains = (g, dummyChains) => {
      const postorderNums = dfsBothOrder(g);
      dummyChains.forEach((startV) => {
          var _a, _b;
          let v = startV;
          let node = g.getNode(v);
          const originalEdge = node.data.originalEdge;
          if (!originalEdge)
              return;
          const pathData = findPath(g, postorderNums, originalEdge.source, originalEdge.target);
          const path = pathData.path;
          const lca = pathData.lca;
          let pathIdx = 0;
          let pathV = path[pathIdx];
          let ascending = true;
          while (v !== originalEdge.target) {
              node = g.getNode(v);
              if (ascending) {
                  while (pathV !== lca &&
                      ((_a = g.getNode(pathV)) === null || _a === void 0 ? void 0 : _a.data.maxRank) < node.data.rank) {
                      pathIdx++;
                      pathV = path[pathIdx];
                  }
                  if (pathV === lca) {
                      ascending = false;
                  }
              }
              if (!ascending) {
                  while (pathIdx < path.length - 1 &&
                      ((_b = g.getNode(path[pathIdx + 1])) === null || _b === void 0 ? void 0 : _b.data.minRank) <= node.data.rank) {
                      pathIdx++;
                  }
                  pathV = path[pathIdx];
              }
              if (g.hasNode(pathV)) {
                  g.setParent(v, pathV);
              }
              v = g.getSuccessors(v)[0].id;
          }
      });
  };

  /*
   * This module provides coordinate assignment based on Brandes and Köpf, "Fast
   * and Simple Horizontal Coordinate Assignment."
   */
  const findType1Conflicts = (g, layering) => {
      const conflicts = {};
      const visitLayer = (prevLayer, layer) => {
          // last visited node in the previous layer that is incident on an inner
          // segment.
          let k0 = 0;
          // Tracks the last node in this layer scanned for crossings with a type-1
          // segment.
          let scanPos = 0;
          const prevLayerLength = prevLayer.length;
          const lastNode = layer === null || layer === void 0 ? void 0 : layer[(layer === null || layer === void 0 ? void 0 : layer.length) - 1];
          layer === null || layer === void 0 ? void 0 : layer.forEach((v, i) => {
              var _a;
              const w = findOtherInnerSegmentNode(g, v);
              const k1 = w ? g.getNode(w.id).data.order : prevLayerLength;
              if (w || v === lastNode) {
                  (_a = layer.slice(scanPos, i + 1)) === null || _a === void 0 ? void 0 : _a.forEach((scanNode) => {
                      var _a;
                      (_a = g.getPredecessors(scanNode)) === null || _a === void 0 ? void 0 : _a.forEach((u) => {
                          var _a;
                          const uLabel = g.getNode(u.id);
                          const uPos = uLabel.data.order;
                          if ((uPos < k0 || k1 < uPos) &&
                              !(uLabel.data.dummy && ((_a = g.getNode(scanNode)) === null || _a === void 0 ? void 0 : _a.data.dummy))) {
                              addConflict(conflicts, u.id, scanNode);
                          }
                      });
                  });
                  scanPos = i + 1;
                  k0 = k1;
              }
          });
          return layer;
      };
      if (layering === null || layering === void 0 ? void 0 : layering.length) {
          layering.reduce(visitLayer);
      }
      return conflicts;
  };
  const findType2Conflicts = (g, layering) => {
      const conflicts = {};
      function scan(south, southPos, southEnd, prevNorthBorder, nextNorthBorder) {
          var _a, _b;
          let v;
          for (let i = southPos; i < southEnd; i++) {
              v = south[i];
              if ((_a = g.getNode(v)) === null || _a === void 0 ? void 0 : _a.data.dummy) {
                  (_b = g.getPredecessors(v)) === null || _b === void 0 ? void 0 : _b.forEach((u) => {
                      const uNode = g.getNode(u.id);
                      if (uNode.data.dummy &&
                          (uNode.data.order < prevNorthBorder ||
                              uNode.data.order > nextNorthBorder)) {
                          addConflict(conflicts, u.id, v);
                      }
                  });
              }
          }
      }
      function getScannedKey(params) {
          // south数组可能很大，不适合做key
          return JSON.stringify(params.slice(1));
      }
      function scanIfNeeded(params, scanCache) {
          const cacheKey = getScannedKey(params);
          if (scanCache.get(cacheKey))
              return;
          scan(...params);
          scanCache.set(cacheKey, true);
      }
      const visitLayer = (north, south) => {
          let prevNorthPos = -1;
          let nextNorthPos;
          let southPos = 0;
          const scanned = new Map();
          south === null || south === void 0 ? void 0 : south.forEach((v, southLookahead) => {
              var _a;
              if (((_a = g.getNode(v)) === null || _a === void 0 ? void 0 : _a.data.dummy) === 'border') {
                  const predecessors = g.getPredecessors(v) || [];
                  if (predecessors.length) {
                      nextNorthPos = g.getNode(predecessors[0].id).data.order;
                      scanIfNeeded([south, southPos, southLookahead, prevNorthPos, nextNorthPos], scanned);
                      southPos = southLookahead;
                      prevNorthPos = nextNorthPos;
                  }
              }
              scanIfNeeded([south, southPos, south.length, nextNorthPos, north.length], scanned);
          });
          return south;
      };
      if (layering === null || layering === void 0 ? void 0 : layering.length) {
          layering.reduce(visitLayer);
      }
      return conflicts;
  };
  const findOtherInnerSegmentNode = (g, v) => {
      var _a, _b;
      if ((_a = g.getNode(v)) === null || _a === void 0 ? void 0 : _a.data.dummy) {
          return (_b = g.getPredecessors(v)) === null || _b === void 0 ? void 0 : _b.find((u) => g.getNode(u.id).data.dummy);
      }
  };
  const addConflict = (conflicts, v, w) => {
      let vv = v;
      let ww = w;
      if (vv > ww) {
          const tmp = vv;
          vv = ww;
          ww = tmp;
      }
      let conflictsV = conflicts[vv];
      if (!conflictsV) {
          conflicts[vv] = conflictsV = {};
      }
      conflictsV[ww] = true;
  };
  const hasConflict = (conflicts, v, w) => {
      let vv = v;
      let ww = w;
      if (vv > ww) {
          const tmp = v;
          vv = ww;
          ww = tmp;
      }
      return !!conflicts[vv];
  };
  /*
   * Try to align nodes into vertical "blocks" where possible. This algorithm
   * attempts to align a node with one of its median neighbors. If the edge
   * connecting a neighbor is a type-1 conflict then we ignore that possibility.
   * If a previous node has already formed a block with a node after the node
   * we're trying to form a block with, we also ignore that possibility - our
   * blocks would be split in that scenario.
   */
  const verticalAlignment = (g, layering, conflicts, neighborFn) => {
      const root = {};
      const align = {};
      const pos = {};
      // We cache the position here based on the layering because the graph and
      // layering may be out of sync. The layering matrix is manipulated to
      // generate different extreme alignments.
      layering === null || layering === void 0 ? void 0 : layering.forEach((layer) => {
          layer === null || layer === void 0 ? void 0 : layer.forEach((v, order) => {
              root[v] = v;
              align[v] = v;
              pos[v] = order;
          });
      });
      layering === null || layering === void 0 ? void 0 : layering.forEach((layer) => {
          let prevIdx = -1;
          layer === null || layer === void 0 ? void 0 : layer.forEach((v) => {
              let ws = neighborFn(v).map((n) => n.id);
              if (ws.length) {
                  ws = ws.sort((a, b) => pos[a] - pos[b]);
                  const mp = (ws.length - 1) / 2;
                  for (let i = Math.floor(mp), il = Math.ceil(mp); i <= il; ++i) {
                      const w = ws[i];
                      if (align[v] === v &&
                          prevIdx < pos[w] &&
                          !hasConflict(conflicts, v, w)) {
                          align[w] = v;
                          align[v] = root[v] = root[w];
                          prevIdx = pos[w];
                      }
                  }
              }
          });
      });
      return { root, align };
  };
  const horizontalCompaction = (g, layering, root, align, nodesep, edgesep, reverseSep) => {
      var _a;
      // This portion of the algorithm differs from BK due to a number of problems.
      // Instead of their algorithm we construct a new block graph and do two
      // sweeps. The first sweep places blocks with the smallest possible
      // coordinates. The second sweep removes unused space by moving blocks to the
      // greatest coordinates without violating separation.
      const xs = {};
      const blockG = buildBlockGraph(g, layering, root, nodesep, edgesep, reverseSep);
      const borderType = reverseSep ? 'borderLeft' : 'borderRight';
      const iterate = (setXsFunc, nextNodesFunc) => {
          let stack = blockG.getAllNodes();
          let elem = stack.pop();
          const visited = {};
          while (elem) {
              if (visited[elem.id]) {
                  setXsFunc(elem.id);
              }
              else {
                  visited[elem.id] = true;
                  stack.push(elem);
                  stack = stack.concat(nextNodesFunc(elem.id));
              }
              elem = stack.pop();
          }
      };
      // First pass, assign smallest coordinates
      const pass1 = (elem) => {
          xs[elem] = (blockG.getRelatedEdges(elem, 'in') || []).reduce((acc, e) => {
              return Math.max(acc, (xs[e.source] || 0) + e.data.weight);
          }, 0);
      };
      // Second pass, assign greatest coordinates
      const pass2 = (elem) => {
          const min = (blockG.getRelatedEdges(elem, 'out') || []).reduce((acc, e) => {
              return Math.min(acc, (xs[e.target] || 0) - e.data.weight);
          }, Number.POSITIVE_INFINITY);
          const node = g.getNode(elem);
          if (min !== Number.POSITIVE_INFINITY &&
              node.data.borderType !== borderType) {
              xs[elem] = Math.max(xs[elem], min);
          }
      };
      iterate(pass1, blockG.getPredecessors.bind(blockG));
      iterate(pass2, blockG.getSuccessors.bind(blockG));
      // Assign x coordinates to all nodes
      (_a = Object.values(align)) === null || _a === void 0 ? void 0 : _a.forEach((v) => {
          xs[v] = xs[root[v]];
      });
      return xs;
  };
  const buildBlockGraph = (g, layering, root, nodesep, edgesep, reverseSep) => {
      const blockGraph = new Graph();
      const sepFn = sep(nodesep, edgesep, reverseSep);
      layering === null || layering === void 0 ? void 0 : layering.forEach((layer) => {
          let u;
          layer === null || layer === void 0 ? void 0 : layer.forEach((v) => {
              const vRoot = root[v];
              if (!blockGraph.hasNode(vRoot)) {
                  blockGraph.addNode({
                      id: vRoot,
                      data: {},
                  });
              }
              if (u) {
                  const uRoot = root[u];
                  const edge = blockGraph
                      .getRelatedEdges(uRoot, 'out')
                      .find((edge) => edge.target === vRoot);
                  if (!edge) {
                      blockGraph.addEdge({
                          id: `e${Math.random()}`,
                          source: uRoot,
                          target: vRoot,
                          data: {
                              weight: Math.max(sepFn(g, v, u), 0),
                          },
                      });
                  }
                  else {
                      blockGraph.updateEdgeData(edge.id, Object.assign(Object.assign({}, edge.data), { weight: Math.max(sepFn(g, v, u), edge.data.weight || 0) }));
                  }
              }
              u = v;
          });
      });
      return blockGraph;
  };
  /*
   * Returns the alignment that has the smallest width of the given alignments.
   */
  const findSmallestWidthAlignment = (g, xss) => {
      return minBy(Object.values(xss), (xs) => {
          var _a;
          let max = Number.NEGATIVE_INFINITY;
          let min = Number.POSITIVE_INFINITY;
          (_a = Object.keys(xs)) === null || _a === void 0 ? void 0 : _a.forEach((v) => {
              const x = xs[v];
              const halfWidth = width(g, v) / 2;
              max = Math.max(x + halfWidth, max);
              min = Math.min(x - halfWidth, min);
          });
          return max - min;
      });
  };
  /*
   * Align the coordinates of each of the layout alignments such that
   * left-biased alignments have their minimum coordinate at the same point as
   * the minimum coordinate of the smallest width alignment and right-biased
   * alignments have their maximum coordinate at the same point as the maximum
   * coordinate of the smallest width alignment.
   */
  function alignCoordinates(xss, alignTo) {
      const alignToVals = Object.values(alignTo);
      const alignToMin = Math.min(...alignToVals);
      const alignToMax = Math.max(...alignToVals);
      ['u', 'd'].forEach((vert) => {
          ['l', 'r'].forEach((horiz) => {
              const alignment = vert + horiz;
              const xs = xss[alignment];
              let delta;
              if (xs === alignTo)
                  return;
              const xsVals = Object.values(xs);
              delta =
                  horiz === 'l'
                      ? alignToMin - Math.min(...xsVals)
                      : alignToMax - Math.max(...xsVals);
              if (delta) {
                  xss[alignment] = {};
                  Object.keys(xs).forEach((key) => {
                      xss[alignment][key] = xs[key] + delta;
                  });
              }
          });
      });
  }
  const balance = (xss, align) => {
      const result = {};
      Object.keys(xss.ul).forEach((key) => {
          if (align) {
              result[key] = xss[align.toLowerCase()][key];
          }
          else {
              const values = Object.values(xss).map((x) => x[key]);
              result[key] = (values[0] + values[1]) / 2; // (ur + ul) / 2
          }
      });
      return result;
  };
  const sep = (nodeSep, edgeSep, reverseSep) => {
      return (g, v, w) => {
          const vLabel = g.getNode(v);
          const wLabel = g.getNode(w);
          let sum = 0;
          let delta = 0;
          sum += vLabel.data.width / 2;
          if (vLabel.data.hasOwnProperty('labelpos')) {
              switch ((vLabel.data.labelpos || '').toLowerCase()) {
                  case 'l':
                      delta = -vLabel.data.width / 2;
                      break;
                  case 'r':
                      delta = vLabel.data.width / 2;
                      break;
              }
          }
          if (delta) {
              sum += reverseSep ? delta : -delta;
          }
          delta = 0;
          sum += (vLabel.data.dummy ? edgeSep : nodeSep) / 2;
          sum += (wLabel.data.dummy ? edgeSep : nodeSep) / 2;
          sum += wLabel.data.width / 2;
          if (wLabel.data.labelpos) {
              switch ((wLabel.data.labelpos || '').toLowerCase()) {
                  case 'l':
                      delta = wLabel.data.width / 2;
                      break;
                  case 'r':
                      delta = -wLabel.data.width / 2;
                      break;
              }
          }
          if (delta) {
              sum += reverseSep ? delta : -delta;
          }
          delta = 0;
          return sum;
      };
  };
  const width = (g, v) => g.getNode(v).data.width || 0;

  const positionY = (g, options) => {
      const { ranksep = 0 } = options || {};
      const layering = buildLayerMatrix(g);
      let prevY = 0;
      layering === null || layering === void 0 ? void 0 : layering.forEach((layer) => {
          const heights = layer.map((v) => g.getNode(v).data.height);
          const maxHeight = Math.max(...heights, 0);
          layer === null || layer === void 0 ? void 0 : layer.forEach((v) => {
              g.getNode(v).data.y = prevY + maxHeight / 2;
          });
          prevY += maxHeight + ranksep;
      });
  };
  const positionX = (g, options) => {
      const { align: graphAlign, nodesep = 0, edgesep = 0 } = options || {};
      const layering = buildLayerMatrix(g);
      const conflicts = Object.assign(findType1Conflicts(g, layering), findType2Conflicts(g, layering));
      const xss = {};
      let adjustedLayering = [];
      ['u', 'd'].forEach((vert) => {
          adjustedLayering =
              vert === 'u' ? layering : Object.values(layering).reverse();
          ['l', 'r'].forEach((horiz) => {
              if (horiz === 'r') {
                  adjustedLayering = adjustedLayering.map((inner) => Object.values(inner).reverse());
              }
              const neighborFn = (vert === 'u' ? g.getPredecessors : g.getSuccessors).bind(g);
              const align = verticalAlignment(g, adjustedLayering, conflicts, neighborFn);
              const xs = horizontalCompaction(g, adjustedLayering, align.root, align.align, nodesep, edgesep, horiz === 'r');
              if (horiz === 'r') {
                  Object.keys(xs).forEach((xsKey) => (xs[xsKey] = -xs[xsKey]));
              }
              xss[vert + horiz] = xs;
          });
      });
      const smallestWidth = findSmallestWidthAlignment(g, xss);
      smallestWidth && alignCoordinates(xss, smallestWidth);
      return balance(xss, graphAlign);
  };
  const position = (g, options) => {
      var _a;
      const ng = asNonCompoundGraph(g);
      positionY(ng, options);
      const xs = positionX(ng, options);
      (_a = Object.keys(xs)) === null || _a === void 0 ? void 0 : _a.forEach((key) => {
          ng.getNode(key).data.x = xs[key];
      });
  };

  /*
   * Initializes ranks for the input graph using the longest path algorithm. This
   * algorithm scales well and is fast in practice, it yields rather poor
   * solutions. Nodes are pushed to the lowest layer possible, leaving the bottom
   * ranks wide and leaving edges longer than necessary. However, due to its
   * speed, this algorithm is good for getting an initial ranking that can be fed
   * into other algorithms.
   *
   * This algorithm does not normalize layers because it will be used by other
   * algorithms in most cases. If using this algorithm directly, be sure to
   * run normalize at the end.
   *
   * Pre-conditions:
   *
   *    1. Input graph is a DAG.
   *    2. Input graph node labels can be assigned properties.
   *
   * Post-conditions:
   *
   *    1. Each node will be assign an (unnormalized) "rank" property.
   */
  const longestPath = (g) => {
      const visited = {};
      const dfs = (v) => {
          var _a;
          const label = g.getNode(v);
          if (!label)
              return 0;
          if (visited[v]) {
              return label.data.rank;
          }
          visited[v] = true;
          let rank;
          (_a = g.getRelatedEdges(v, 'out')) === null || _a === void 0 ? void 0 : _a.forEach((e) => {
              const wRank = dfs(e.target);
              const minLen = e.data.minlen;
              const r = wRank - minLen;
              if (r) {
                  if (rank === undefined || r < rank) {
                      rank = r;
                  }
              }
          });
          if (!rank) {
              rank = 0;
          }
          label.data.rank = rank;
          return rank;
      };
      g.getAllNodes()
          .filter((n) => g.getRelatedEdges(n.id, 'in').length === 0)
          .forEach((source) => dfs(source.id));
  };
  const longestPathWithLayer = (g) => {
      // 用longest path，找出最深的点
      const visited = {};
      let minRank;
      const dfs = (v) => {
          var _a;
          const label = g.getNode(v);
          if (!label)
              return 0;
          if (visited[v]) {
              return label.data.rank;
          }
          visited[v] = true;
          let rank;
          (_a = g.getRelatedEdges(v, 'out')) === null || _a === void 0 ? void 0 : _a.forEach((e) => {
              const wRank = dfs(e.target);
              const minLen = e.data.minlen;
              const r = wRank - minLen;
              if (r) {
                  if (rank === undefined || r < rank) {
                      rank = r;
                  }
              }
          });
          if (!rank) {
              rank = 0;
          }
          if (minRank === undefined || rank < minRank) {
              minRank = rank;
          }
          label.data.rank = rank;
          return rank;
      };
      g.getAllNodes()
          .filter((n) => g.getRelatedEdges(n.id, 'in').length === 0)
          .forEach((source) => {
          if (source)
              dfs(source.id);
      });
      if (minRank === undefined) {
          minRank = 0;
      }
      // minRank += 1; // NOTE: 最小的层级是dummy root，+1
      // forward一遍，赋值层级
      const forwardVisited = {};
      const dfsForward = (v, nextRank) => {
          var _a;
          const label = g.getNode(v);
          const currRank = !isNaN(label.data.layer) ? label.data.layer : nextRank;
          // 没有指定，取最大值
          if (label.data.rank === undefined || label.data.rank < currRank) {
              label.data.rank = currRank;
          }
          if (forwardVisited[v])
              return;
          forwardVisited[v] = true;
          // DFS遍历子节点
          (_a = g.getRelatedEdges(v, 'out')) === null || _a === void 0 ? void 0 : _a.forEach((e) => {
              dfsForward(e.target, currRank + e.data.minlen);
          });
      };
      // 指定层级的，更新下游
      g.getAllNodes().forEach((n) => {
          const label = n.data;
          if (!label)
              return;
          if (!isNaN(label.layer)) {
              dfsForward(n.id, label.layer); // 默认的dummy root所在层的rank是-1
          }
          else {
              label.rank -= minRank;
          }
      });
  };
  /*
   * Returns the amount of slack for the given edge. The slack is defined as the
   * difference between the length of the edge and its minimum length.
   */
  const slack = (g, e) => {
      return (g.getNode(e.target).data.rank -
          g.getNode(e.source).data.rank -
          e.data.minlen);
  };

  /*
   * Constructs a spanning tree with tight edges and adjusted the input node's
   * ranks to achieve this. A tight edge is one that is has a length that matches
   * its "minlen" attribute.
   *
   * The basic structure for this function is derived from Gansner, et al., "A
   * Technique for Drawing Directed Graphs."
   *
   * Pre-conditions:
   *
   *    1. Graph must be a DAG.
   *    2. Graph must be connected.
   *    3. Graph must have at least one node.
   *    5. Graph nodes must have been previously assigned a "rank" property that
   *       respects the "minlen" property of incident edges.
   *    6. Graph edges must have a "minlen" property.
   *
   * Post-conditions:
   *
   *    - Graph nodes will have their rank adjusted to ensure that all edges are
   *      tight.
   *
   * Returns a tree (undirected graph) that is constructed using only "tight"
   * edges.
   */
  const feasibleTree = (g) => {
      const t = new Graph({
          tree: [],
      });
      // Choose arbitrary node from which to start our tree
      const start = g.getAllNodes()[0];
      const size = g.getAllNodes().length;
      t.addNode(start);
      let edge;
      let delta;
      while (tightTree(t, g) < size) {
          edge = findMinSlackEdge(t, g);
          delta = t.hasNode(edge.source) ? slack(g, edge) : -slack(g, edge);
          shiftRanks(t, g, delta);
      }
      return t;
  };
  /*
   * Finds a maximal tree of tight edges and returns the number of nodes in the
   * tree.
   */
  const tightTree = (t, g) => {
      const dfs = (v) => {
          g.getRelatedEdges(v, 'both').forEach((e) => {
              const edgeV = e.source;
              const w = v === edgeV ? e.target : edgeV;
              if (!t.hasNode(w) && !slack(g, e)) {
                  t.addNode({
                      id: w,
                      data: {},
                  });
                  t.addEdge({
                      id: e.id,
                      source: v,
                      target: w,
                      data: {},
                  });
                  dfs(w);
              }
          });
      };
      t.getAllNodes().forEach((n) => dfs(n.id));
      return t.getAllNodes().length;
  };
  /*
   * Constructs a spanning tree with tight edges and adjusted the input node's
   * ranks to achieve this. A tight edge is one that is has a length that matches
   * its "minlen" attribute.
   *
   * The basic structure for this function is derived from Gansner, et al., "A
   * Technique for Drawing Directed Graphs."
   *
   * Pre-conditions:
   *
   *    1. Graph must be a DAG.
   *    2. Graph must be connected.
   *    3. Graph must have at least one node.
   *    5. Graph nodes must have been previously assigned a "rank" property that
   *       respects the "minlen" property of incident edges.
   *    6. Graph edges must have a "minlen" property.
   *
   * Post-conditions:
   *
   *    - Graph nodes will have their rank adjusted to ensure that all edges are
   *      tight.
   *
   * Returns a tree (undirected graph) that is constructed using only "tight"
   * edges.
   */
  const feasibleTreeWithLayer = (g) => {
      const t = new Graph({ tree: [] });
      // Choose arbitrary node from which to start our tree
      const start = g.getAllNodes()[0];
      const size = g.getAllNodes().length;
      t.addNode(start);
      let edge;
      let delta;
      while (tightTreeWithLayer(t, g) < size) {
          edge = findMinSlackEdge(t, g);
          delta = t.hasNode(edge.source) ? slack(g, edge) : -slack(g, edge);
          shiftRanks(t, g, delta);
      }
      return t;
  };
  /*
   * Finds a maximal tree of tight edges and returns the number of nodes in the
   * tree.
   */
  const tightTreeWithLayer = (t, g) => {
      const dfs = (v) => {
          var _a;
          (_a = g.getRelatedEdges(v, 'both')) === null || _a === void 0 ? void 0 : _a.forEach((e) => {
              const edgeV = e.source;
              const w = v === edgeV ? e.target : edgeV;
              // 对于指定layer的，直接加入tight-tree，不参与调整
              if (!t.hasNode(w) &&
                  (g.getNode(w).data.layer !== undefined || !slack(g, e))) {
                  t.addNode({
                      id: w,
                      data: {},
                  });
                  t.addEdge({
                      id: e.id,
                      source: v,
                      target: w,
                      data: {},
                  });
                  dfs(w);
              }
          });
      };
      t.getAllNodes().forEach((n) => dfs(n.id));
      return t.getAllNodes().length;
  };
  /*
   * Finds the edge with the smallest slack that is incident on tree and returns
   * it.
   */
  const findMinSlackEdge = (t, g) => {
      return minBy(g.getAllEdges(), (e) => {
          if (t.hasNode(e.source) !== t.hasNode(e.target)) {
              return slack(g, e);
          }
          return Infinity;
      });
  };
  const shiftRanks = (t, g, delta) => {
      t.getAllNodes().forEach((tn) => {
          const v = g.getNode(tn.id);
          if (!v.data.rank)
              v.data.rank = 0;
          v.data.rank += delta;
      });
  };

  /*
   * The network simplex algorithm assigns ranks to each node in the input graph
   * and iteratively improves the ranking to reduce the length of edges.
   *
   * Preconditions:
   *
   *    1. The input graph must be a DAG.
   *    2. All nodes in the graph must have an object value.
   *    3. All edges in the graph must have "minlen" and "weight" attributes.
   *
   * Postconditions:
   *
   *    1. All nodes in the graph will have an assigned "rank" attribute that has
   *       been optimized by the network simplex algorithm. Ranks start at 0.
   *
   *
   * A rough sketch of the algorithm is as follows:
   *
   *    1. Assign initial ranks to each node. We use the longest path algorithm,
   *       which assigns ranks to the lowest position possible. In general this
   *       leads to very wide bottom ranks and unnecessarily long edges.
   *    2. Construct a feasible tight tree. A tight tree is one such that all
   *       edges in the tree have no slack (difference between length of edge
   *       and minlen for the edge). This by itself greatly improves the assigned
   *       rankings by shorting edges.
   *    3. Iteratively find edges that have negative cut values. Generally a
   *       negative cut value indicates that the edge could be removed and a new
   *       tree edge could be added to produce a more compact graph.
   *
   * Much of the algorithms here are derived from Gansner, et al., "A Technique
   * for Drawing Directed Graphs." The structure of the file roughly follows the
   * structure of the overall algorithm.
   */
  const networkSimplex = (og) => {
      const g = simplify(og);
      longestPath(g);
      const t = feasibleTree(g);
      initLowLimValues(t);
      initCutValues(t, g);
      let e;
      let f;
      while ((e = leaveEdge(t))) {
          f = enterEdge(t, g, e);
          exchangeEdges(t, g, e, f);
      }
  };
  /*
   * Initializes cut values for all edges in the tree.
   */
  const initCutValues = (t, g) => {
      let vs = dfs$1(t, t.getAllNodes(), 'post');
      vs = vs.slice(0, (vs === null || vs === void 0 ? void 0 : vs.length) - 1);
      vs.forEach((v) => {
          assignCutValue(t, g, v);
      });
  };
  const assignCutValue = (t, g, child) => {
      const childLab = t.getNode(child);
      const parent = childLab.data.parent;
      // FIXME: use undirected edge?
      const edge = t
          .getRelatedEdges(child, 'both')
          .find((e) => e.target === parent || e.source === parent);
      edge.data.cutvalue = calcCutValue(t, g, child);
  };
  /*
   * Given the tight tree, its graph, and a child in the graph calculate and
   * return the cut value for the edge between the child and its parent.
   */
  const calcCutValue = (t, g, child) => {
      const childLab = t.getNode(child);
      const parent = childLab.data.parent;
      // True if the child is on the tail end of the edge in the directed graph
      let childIsTail = true;
      // The graph's view of the tree edge we're inspecting
      let graphEdge = g
          .getRelatedEdges(child, 'out')
          .find((e) => e.target === parent);
      // The accumulated cut value for the edge between this node and its parent
      let cutValue = 0;
      if (!graphEdge) {
          childIsTail = false;
          graphEdge = g
              .getRelatedEdges(parent, 'out')
              .find((e) => e.target === child);
      }
      cutValue = graphEdge.data.weight;
      g.getRelatedEdges(child, 'both').forEach((e) => {
          const isOutEdge = e.source === child;
          const other = isOutEdge ? e.target : e.source;
          if (other !== parent) {
              const pointsToHead = isOutEdge === childIsTail;
              const otherWeight = e.data.weight;
              cutValue += pointsToHead ? otherWeight : -otherWeight;
              if (isTreeEdge(t, child, other)) {
                  // FIXME: use undirected edge?
                  const otherCutValue = t
                      .getRelatedEdges(child, 'both')
                      .find((e) => e.source === other || e.target === other).data
                      .cutvalue;
                  cutValue += pointsToHead ? -otherCutValue : otherCutValue;
              }
          }
      });
      return cutValue;
  };
  const initLowLimValues = (tree, root = tree.getAllNodes()[0].id) => {
      dfsAssignLowLim(tree, {}, 1, root);
  };
  const dfsAssignLowLim = (tree, visited, nextLim, v, parent) => {
      var _a;
      const low = nextLim;
      let useNextLim = nextLim;
      const label = tree.getNode(v);
      visited[v] = true;
      (_a = tree.getNeighbors(v)) === null || _a === void 0 ? void 0 : _a.forEach((w) => {
          if (!visited[w.id]) {
              useNextLim = dfsAssignLowLim(tree, visited, useNextLim, w.id, v);
          }
      });
      label.data.low = low;
      label.data.lim = useNextLim++;
      if (parent) {
          label.data.parent = parent;
      }
      else {
          // TODO should be able to remove this when we incrementally update low lim
          delete label.data.parent;
      }
      return useNextLim;
  };
  const leaveEdge = (tree) => {
      return tree.getAllEdges().find((e) => {
          return e.data.cutvalue < 0;
      });
  };
  const enterEdge = (t, g, edge) => {
      let v = edge.source;
      let w = edge.target;
      // For the rest of this function we assume that v is the tail and w is the
      // head, so if we don't have this edge in the graph we should flip it to
      // match the correct orientation.
      if (!g.getRelatedEdges(v, 'out').find((e) => e.target === w)) {
          v = edge.target;
          w = edge.source;
      }
      const vLabel = t.getNode(v);
      const wLabel = t.getNode(w);
      let tailLabel = vLabel;
      let flip = false;
      // If the root is in the tail of the edge then we need to flip the logic that
      // checks for the head and tail nodes in the candidates function below.
      if (vLabel.data.lim > wLabel.data.lim) {
          tailLabel = wLabel;
          flip = true;
      }
      const candidates = g.getAllEdges().filter((edge) => {
          return (flip === isDescendant(t.getNode(edge.source), tailLabel) &&
              flip !== isDescendant(t.getNode(edge.target), tailLabel));
      });
      return minBy(candidates, (edge) => {
          return slack(g, edge);
      });
  };
  /**
   *
   * @param t
   * @param g
   * @param e edge to remove
   * @param f edge to add
   */
  const exchangeEdges = (t, g, e, f) => {
      // FIXME: use undirected edge?
      const existed = t
          .getRelatedEdges(e.source, 'both')
          .find((edge) => edge.source === e.target || edge.target === e.target);
      if (existed) {
          t.removeEdge(existed.id);
      }
      t.addEdge({
          id: `e${Math.random()}`,
          source: f.source,
          target: f.target,
          data: {},
      });
      initLowLimValues(t);
      initCutValues(t, g);
      updateRanks(t, g);
  };
  const updateRanks = (t, g) => {
      const root = t.getAllNodes().find((v) => {
          return !v.data.parent;
      });
      let vs = dfs$1(t, root, 'pre');
      vs = vs.slice(1);
      vs.forEach((v) => {
          const parent = t.getNode(v).data.parent;
          let edge = g.getRelatedEdges(v, 'out').find((e) => e.target === parent);
          // let edge = g.edgeFromArgs(v, parent);
          let flipped = false;
          if (!edge && g.hasNode(parent)) {
              // edge = g.edgeFromArgs(parent, v)!;
              edge = g.getRelatedEdges(parent, 'out').find((e) => e.target === v);
              flipped = true;
          }
          g.getNode(v).data.rank =
              ((g.hasNode(parent) && g.getNode(parent).data.rank) || 0) +
                  (flipped ? edge === null || edge === void 0 ? void 0 : edge.data.minlen : -(edge === null || edge === void 0 ? void 0 : edge.data.minlen));
      });
  };
  /*
   * Returns true if the edge is in the tree.
   */
  const isTreeEdge = (tree, u, v) => {
      // FIXME: use undirected edge?
      return tree
          .getRelatedEdges(u, 'both')
          .find((e) => e.source === v || e.target === v);
  };
  /*
   * Returns true if the specified node is descendant of the root node per the
   * assigned low and lim attributes in the tree.
   */
  const isDescendant = (vLabel, rootLabel) => {
      return (rootLabel.data.low <= vLabel.data.lim &&
          vLabel.data.lim <= rootLabel.data.lim);
  };

  /*
   * Assigns a rank to each node in the input graph that respects the "minlen"
   * constraint specified on edges between nodes.
   *
   * This basic structure is derived from Gansner, et al., "A Technique for
   * Drawing Directed Graphs."
   *
   * Pre-conditions:
   *
   *    1. Graph must be a connected DAG
   *    2. Graph nodes must be objects
   *    3. Graph edges must have "weight" and "minlen" attributes
   *
   * Post-conditions:
   *
   *    1. Graph nodes will have a "rank" attribute based on the results of the
   *       algorithm. Ranks can start at any index (including negative), we'll
   *       fix them up later.
   */
  const rank = (g, ranker) => {
      switch (ranker) {
          case 'network-simplex':
              networkSimplexRanker(g);
              break;
          case 'tight-tree':
              tightTreeRanker(g);
              break;
          case 'longest-path':
              longestPathRanker(g);
              break;
          // default: networkSimplexRanker(g);
          default:
              tightTreeRanker(g);
      }
  };
  // A fast and simple ranker, but results are far from optimal.
  const longestPathRanker = longestPath;
  const tightTreeRanker = (g) => {
      longestPathWithLayer(g);
      feasibleTreeWithLayer(g);
  };
  const networkSimplexRanker = (g) => {
      networkSimplex(g);
  };

  // const graphNumAttrs = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"];
  // const graphDefaults = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" };
  // const graphAttrs = ["acyclicer", "ranker", "rankdir", "align"];
  const layout = (g, options) => {
      const { edgeLabelSpace, keepNodeOrder, prevGraph, rankdir, ranksep } = options;
      // 如果在原图基础上修改，继承原图的order结果
      if (!keepNodeOrder && prevGraph) {
          inheritOrder(g, prevGraph);
      }
      const layoutGraph = buildLayoutGraph(g);
      // 控制是否为边的label留位置（这会影响是否在边中间添加dummy node）
      if (!!edgeLabelSpace) {
          options.ranksep = makeSpaceForEdgeLabels(layoutGraph, {
              rankdir,
              ranksep,
          });
      }
      let dimension;
      // TODO: 暂时处理层级设置不正确时的异常报错，提示设置正确的层级
      try {
          dimension = runLayout(layoutGraph, options);
      }
      catch (e) {
          if (e.message === 'Not possible to find intersection inside of the rectangle') {
              console.error("The following error may be caused by improper layer setting, please make sure your manual layer setting does not violate the graph's structure:\n", e);
              return;
          }
          throw e;
      }
      updateInputGraph(g, layoutGraph);
      return dimension;
  };
  const runLayout = (g, options) => {
      const { ranker, rankdir = 'tb', nodeOrder, keepNodeOrder, align, nodesep = 50, edgesep = 20, ranksep = 50, } = options;
      removeSelfEdges(g);
      run$2(g);
      const { nestingRoot, nodeRankFactor } = run$1(g);
      rank(asNonCompoundGraph(g), ranker);
      injectEdgeLabelProxies(g);
      removeEmptyRanks(g, nodeRankFactor);
      cleanup(g, nestingRoot);
      normalizeRanks(g);
      assignRankMinMax(g);
      removeEdgeLabelProxies(g);
      const dummyChains = [];
      run(g, dummyChains);
      parentDummyChains(g, dummyChains);
      addBorderSegments(g);
      if (keepNodeOrder) {
          initDataOrder(g, nodeOrder);
      }
      order(g, keepNodeOrder);
      insertSelfEdges(g);
      adjust(g, rankdir);
      position(g, {
          align,
          nodesep,
          edgesep,
          ranksep,
      });
      positionSelfEdges(g);
      removeBorderNodes(g);
      undo(g, dummyChains);
      fixupEdgeLabelCoords(g);
      undo$1(g, rankdir);
      const { width, height } = translateGraph(g);
      assignNodeIntersects(g);
      reversePointsForReversedEdges(g);
      undo$2(g);
      return { width, height };
  };
  /**
   * 继承上一个布局中的order，防止翻转
   * TODO: 暂时没有考虑涉及层级变动的布局，只保证原来布局层级和相对顺序不变
   */
  const inheritOrder = (currG, prevG) => {
      currG.getAllNodes().forEach((n) => {
          const node = currG.getNode(n.id);
          if (prevG.hasNode(n.id)) {
              const prevNode = prevG.getNode(n.id);
              node.data.fixorder = prevNode.data._order;
              delete prevNode.data._order;
          }
          else {
              delete node.data.fixorder;
          }
      });
  };
  /*
   * Copies final layout information from the layout graph back to the input
   * graph. This process only copies whitelisted attributes from the layout graph
   * to the input graph, so it serves as a good place to determine what
   * attributes can influence layout.
   */
  const updateInputGraph = (inputGraph, layoutGraph) => {
      inputGraph.getAllNodes().forEach((v) => {
          var _a;
          const inputLabel = inputGraph.getNode(v.id);
          if (inputLabel) {
              const layoutLabel = layoutGraph.getNode(v.id);
              inputLabel.data.x = layoutLabel.data.x;
              inputLabel.data.y = layoutLabel.data.y;
              inputLabel.data._order = layoutLabel.data.order;
              inputLabel.data._rank = layoutLabel.data.rank;
              if ((_a = layoutGraph.getChildren(v.id)) === null || _a === void 0 ? void 0 : _a.length) {
                  inputLabel.data.width = layoutLabel.data.width;
                  inputLabel.data.height = layoutLabel.data.height;
              }
          }
      });
      inputGraph.getAllEdges().forEach((e) => {
          const inputLabel = inputGraph.getEdge(e.id);
          const layoutLabel = layoutGraph.getEdge(e.id);
          inputLabel.data.points = layoutLabel ? layoutLabel.data.points : [];
          if (layoutLabel && layoutLabel.data.hasOwnProperty('x')) {
              inputLabel.data.x = layoutLabel.data.x;
              inputLabel.data.y = layoutLabel.data.y;
          }
      });
      // inputGraph.graph().width = layoutGraph.graph().width;
      // inputGraph.graph().height = layoutGraph.graph().height;
  };
  const nodeNumAttrs = ['width', 'height', 'layer', 'fixorder']; // 需要传入layer, fixOrder作为参数参考
  const nodeDefaults = { width: 0, height: 0 };
  const edgeNumAttrs = ['minlen', 'weight', 'width', 'height', 'labeloffset'];
  const edgeDefaults = {
      minlen: 1,
      weight: 1,
      width: 0,
      height: 0,
      labeloffset: 10,
      labelpos: 'r',
  };
  const edgeAttrs = ['labelpos'];
  /*
   * Constructs a new graph from the input graph, which can be used for layout.
   * This process copies only whitelisted attributes from the input graph to the
   * layout graph. Thus this function serves as a good place to determine what
   * attributes can influence layout.
   */
  const buildLayoutGraph = (inputGraph) => {
      const g = new Graph({ tree: [] });
      inputGraph.getAllNodes().forEach((v) => {
          const node = canonicalize(inputGraph.getNode(v.id).data);
          const defaultNode = Object.assign(Object.assign({}, nodeDefaults), node);
          const defaultAttrs = selectNumberAttrs(defaultNode, nodeNumAttrs);
          if (!g.hasNode(v.id)) {
              g.addNode({
                  id: v.id,
                  data: Object.assign({}, defaultAttrs),
              });
          }
          const parent = inputGraph.hasTreeStructure('combo')
              ? inputGraph.getParent(v.id, 'combo')
              : inputGraph.getParent(v.id);
          if (!isNil(parent)) {
              if (!g.hasNode(parent.id)) {
                  g.addNode(Object.assign({}, parent));
              }
              g.setParent(v.id, parent.id);
          }
      });
      inputGraph.getAllEdges().forEach((e) => {
          const edge = canonicalize(inputGraph.getEdge(e.id).data);
          const pickedProperties = {};
          edgeAttrs === null || edgeAttrs === void 0 ? void 0 : edgeAttrs.forEach((key) => {
              if (edge[key] !== undefined)
                  pickedProperties[key] = edge[key];
          });
          g.addEdge({
              id: e.id,
              source: e.source,
              target: e.target,
              data: Object.assign({}, edgeDefaults, selectNumberAttrs(edge, edgeNumAttrs), pickedProperties),
          });
      });
      return g;
  };
  /*
   * This idea comes from the Gansner paper: to account for edge labels in our
   * layout we split each rank in half by doubling minlen and halving ranksep.
   * Then we can place labels at these mid-points between nodes.
   *
   * We also add some minimal padding to the width to push the label for the edge
   * away from the edge itself a bit.
   */
  const makeSpaceForEdgeLabels = (g, options) => {
      const { ranksep = 0, rankdir } = options;
      g.getAllNodes().forEach((node) => {
          if (!isNaN(node.data.layer)) {
              if (!node.data.layer)
                  node.data.layer = 0;
          }
      });
      g.getAllEdges().forEach((edge) => {
          var _a;
          edge.data.minlen *= 2;
          if (((_a = edge.data.labelpos) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== 'c') {
              if (rankdir === 'TB' || rankdir === 'BT') {
                  edge.data.width += edge.data.labeloffset;
              }
              else {
                  edge.data.height += edge.data.labeloffset;
              }
          }
      });
      return ranksep / 2;
  };
  /*
   * Creates temporary dummy nodes that capture the rank in which each edge's
   * label is going to, if it has one of non-zero width and height. We do this
   * so that we can safely remove empty ranks while preserving balance for the
   * label's position.
   */
  const injectEdgeLabelProxies = (g) => {
      g.getAllEdges().forEach((e) => {
          if (e.data.width && e.data.height) {
              const v = g.getNode(e.source);
              const w = g.getNode(e.target);
              const label = {
                  e,
                  rank: (w.data.rank - v.data.rank) / 2 + v.data.rank,
              };
              addDummyNode(g, 'edge-proxy', label, '_ep');
          }
      });
  };
  const assignRankMinMax = (g) => {
      let maxRank = 0;
      g.getAllNodes().forEach((node) => {
          var _a, _b;
          if (node.data.borderTop) {
              node.data.minRank = (_a = g.getNode(node.data.borderTop)) === null || _a === void 0 ? void 0 : _a.data.rank;
              node.data.maxRank = (_b = g.getNode(node.data.borderBottom)) === null || _b === void 0 ? void 0 : _b.data.rank;
              maxRank = Math.max(maxRank, node.data.maxRank || -Infinity);
          }
      });
      return maxRank;
  };
  const removeEdgeLabelProxies = (g) => {
      g.getAllNodes().forEach((node) => {
          if (node.data.dummy === 'edge-proxy') {
              g.getEdge(node.data.e.id).data.labelRank = node.data.rank;
              g.removeNode(node.id);
          }
      });
  };
  const translateGraph = (g, options) => {
      let minX;
      let maxX = 0;
      let minY;
      let maxY = 0;
      const { marginx: marginX = 0, marginy: marginY = 0 } = {};
      const getExtremes = (attrs) => {
          if (!attrs.data)
              return;
          const x = attrs.data.x;
          const y = attrs.data.y;
          const w = attrs.data.width;
          const h = attrs.data.height;
          if (!isNaN(x) && !isNaN(w)) {
              if (minX === undefined) {
                  minX = x - w / 2;
              }
              minX = Math.min(minX, x - w / 2);
              maxX = Math.max(maxX, x + w / 2);
          }
          if (!isNaN(y) && !isNaN(h)) {
              if (minY === undefined) {
                  minY = y - h / 2;
              }
              minY = Math.min(minY, y - h / 2);
              maxY = Math.max(maxY, y + h / 2);
          }
      };
      g.getAllNodes().forEach((v) => {
          getExtremes(v);
      });
      g.getAllEdges().forEach((e) => {
          if (e === null || e === void 0 ? void 0 : e.data.hasOwnProperty('x')) {
              getExtremes(e);
          }
      });
      minX -= marginX;
      minY -= marginY;
      g.getAllNodes().forEach((node) => {
          node.data.x -= minX;
          node.data.y -= minY;
      });
      g.getAllEdges().forEach((edge) => {
          var _a;
          (_a = edge.data.points) === null || _a === void 0 ? void 0 : _a.forEach((p) => {
              p.x -= minX;
              p.y -= minY;
          });
          if (edge.data.hasOwnProperty('x')) {
              edge.data.x -= minX;
          }
          if (edge.data.hasOwnProperty('y')) {
              edge.data.y -= minY;
          }
      });
      return {
          width: maxX - minX + marginX,
          height: maxY - minY + marginY,
      };
  };
  const assignNodeIntersects = (g) => {
      g.getAllEdges().forEach((e) => {
          const nodeV = g.getNode(e.source);
          const nodeW = g.getNode(e.target);
          let p1;
          let p2;
          if (!e.data.points) {
              e.data.points = [];
              p1 = { x: nodeW.data.x, y: nodeW.data.y };
              p2 = { x: nodeV.data.x, y: nodeV.data.y };
          }
          else {
              p1 = e.data.points[0];
              p2 = e.data.points[e.data.points.length - 1];
          }
          e.data.points.unshift(intersectRect(nodeV.data, p1));
          e.data.points.push(intersectRect(nodeW.data, p2));
      });
  };
  const fixupEdgeLabelCoords = (g) => {
      g.getAllEdges().forEach((edge) => {
          if (edge.data.hasOwnProperty('x')) {
              if (edge.data.labelpos === 'l' || edge.data.labelpos === 'r') {
                  edge.data.width -= edge.data.labeloffset;
              }
              switch (edge.data.labelpos) {
                  case 'l':
                      edge.data.x -= edge.data.width / 2 + edge.data.labeloffset;
                      break;
                  case 'r':
                      edge.data.x += edge.data.width / 2 + edge.data.labeloffset;
                      break;
              }
          }
      });
  };
  const reversePointsForReversedEdges = (g) => {
      g.getAllEdges().forEach((edge) => {
          var _a;
          if (edge.data.reversed) {
              (_a = edge.data.points) === null || _a === void 0 ? void 0 : _a.reverse();
          }
      });
  };
  const removeBorderNodes = (g) => {
      g.getAllNodes().forEach((v) => {
          var _a, _b, _c;
          if ((_a = g.getChildren(v.id)) === null || _a === void 0 ? void 0 : _a.length) {
              const node = g.getNode(v.id);
              const t = g.getNode(node.data.borderTop);
              const b = g.getNode(node.data.borderBottom);
              const l = g.getNode(node.data.borderLeft[((_b = node.data.borderLeft) === null || _b === void 0 ? void 0 : _b.length) - 1]);
              const r = g.getNode(node.data.borderRight[((_c = node.data.borderRight) === null || _c === void 0 ? void 0 : _c.length) - 1]);
              node.data.width = Math.abs((r === null || r === void 0 ? void 0 : r.data.x) - (l === null || l === void 0 ? void 0 : l.data.x)) || 10;
              node.data.height = Math.abs((b === null || b === void 0 ? void 0 : b.data.y) - (t === null || t === void 0 ? void 0 : t.data.y)) || 10;
              node.data.x = ((l === null || l === void 0 ? void 0 : l.data.x) || 0) + node.data.width / 2;
              node.data.y = ((t === null || t === void 0 ? void 0 : t.data.y) || 0) + node.data.height / 2;
          }
      });
      g.getAllNodes().forEach((n) => {
          if (n.data.dummy === 'border') {
              g.removeNode(n.id);
          }
      });
  };
  const removeSelfEdges = (g) => {
      g.getAllEdges().forEach((e) => {
          if (e.source === e.target) {
              const node = g.getNode(e.source);
              if (!node.data.selfEdges) {
                  node.data.selfEdges = [];
              }
              node.data.selfEdges.push(e);
              g.removeEdge(e.id);
          }
      });
  };
  const insertSelfEdges = (g) => {
      const layers = buildLayerMatrix(g);
      layers === null || layers === void 0 ? void 0 : layers.forEach((layer) => {
          let orderShift = 0;
          layer === null || layer === void 0 ? void 0 : layer.forEach((v, i) => {
              var _a;
              const node = g.getNode(v);
              node.data.order = i + orderShift;
              (_a = node.data.selfEdges) === null || _a === void 0 ? void 0 : _a.forEach((selfEdge) => {
                  addDummyNode(g, 'selfedge', {
                      width: selfEdge.data.width,
                      height: selfEdge.data.height,
                      rank: node.data.rank,
                      order: i + ++orderShift,
                      e: selfEdge,
                  }, '_se');
              });
              delete node.data.selfEdges;
          });
      });
  };
  const positionSelfEdges = (g) => {
      g.getAllNodes().forEach((v) => {
          const node = g.getNode(v.id);
          if (node.data.dummy === 'selfedge') {
              const selfNode = g.getNode(node.data.e.source);
              const x = selfNode.data.x + selfNode.data.width / 2;
              const y = selfNode.data.y;
              const dx = node.data.x - x;
              const dy = selfNode.data.height / 2;
              if (g.hasEdge(node.data.e.id)) {
                  g.updateEdgeData(node.data.e.id, node.data.e.data);
              }
              else {
                  g.addEdge({
                      id: node.data.e.id,
                      source: node.data.e.source,
                      target: node.data.e.target,
                      data: node.data.e.data,
                  });
              }
              g.removeNode(v.id);
              node.data.e.data.points = [
                  { x: x + (2 * dx) / 3, y: y - dy },
                  { x: x + (5 * dx) / 6, y: y - dy },
                  { y, x: x + dx },
                  { x: x + (5 * dx) / 6, y: y + dy },
                  { x: x + (2 * dx) / 3, y: y + dy },
              ];
              node.data.e.data.x = node.data.x;
              node.data.e.data.y = node.data.y;
          }
      });
  };
  const selectNumberAttrs = (obj, attrs) => {
      const pickedProperties = {};
      attrs === null || attrs === void 0 ? void 0 : attrs.forEach((key) => {
          if (obj[key] === undefined)
              return;
          pickedProperties[key] = +obj[key];
      });
      return pickedProperties;
  };
  const canonicalize = (attrs = {}) => {
      const newAttrs = {};
      Object.keys(attrs).forEach((k) => {
          newAttrs[k.toLowerCase()] = attrs[k];
      });
      return newAttrs;
  };

  const isArray = Array.isArray;

  const floydWarshall = (adjMatrix) => {
      // initialize
      const dist = [];
      const size = adjMatrix.length;
      for (let i = 0; i < size; i += 1) {
          dist[i] = [];
          for (let j = 0; j < size; j += 1) {
              if (i === j) {
                  dist[i][j] = 0;
              }
              else if (adjMatrix[i][j] === 0 || !adjMatrix[i][j]) {
                  dist[i][j] = Infinity;
              }
              else {
                  dist[i][j] = adjMatrix[i][j];
              }
          }
      }
      // floyd
      for (let k = 0; k < size; k += 1) {
          for (let i = 0; i < size; i += 1) {
              for (let j = 0; j < size; j += 1) {
                  if (dist[i][j] > dist[i][k] + dist[k][j]) {
                      dist[i][j] = dist[i][k] + dist[k][j];
                  }
              }
          }
      }
      return dist;
  };
  const getAdjMatrix = (data, directed) => {
      const { nodes, edges } = data;
      const matrix = [];
      // map node with index in data.nodes
      const nodeMap = {};
      if (!nodes) {
          throw new Error('invalid nodes data!');
      }
      if (nodes) {
          nodes.forEach((node, i) => {
              nodeMap[node.id] = i;
              const row = [];
              matrix.push(row);
          });
      }
      edges === null || edges === void 0 ? void 0 : edges.forEach((e) => {
          const { source, target } = e;
          const sIndex = nodeMap[source];
          const tIndex = nodeMap[target];
          if (sIndex === undefined || tIndex === undefined)
              return;
          matrix[sIndex][tIndex] = 1;
          {
              matrix[tIndex][sIndex] = 1;
          }
      });
      return matrix;
  };
  /**
   * scale matrix
   * @param matrix [ [], [], [] ]
   * @param ratio
   */
  const scaleMatrix = (matrix, ratio) => {
      const result = [];
      matrix.forEach((row) => {
          const newRow = [];
          row.forEach((v) => {
              newRow.push(v * ratio);
          });
          result.push(newRow);
      });
      return result;
  };
  /**
   * calculate the bounding box for the nodes according to their x, y, and size
   * @param nodes nodes in the layout
   * @returns
   */
  const getLayoutBBox = (nodes) => {
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      nodes.forEach((node) => {
          let size = node.data.size;
          if (isArray(size)) {
              if (size.length === 1)
                  size = [size[0], size[0]];
          }
          else if (isNumber(size)) {
              size = [size, size];
          }
          else if (size === undefined || isNaN(size)) {
              size = [30, 30];
          }
          const halfSize = [size[0] / 2, size[1] / 2];
          const left = node.data.x - halfSize[0];
          const right = node.data.x + halfSize[0];
          const top = node.data.y - halfSize[1];
          const bottom = node.data.y + halfSize[1];
          if (minX > left)
              minX = left;
          if (minY > top)
              minY = top;
          if (maxX < right)
              maxX = right;
          if (maxY < bottom)
              maxY = bottom;
      });
      return { minX, minY, maxX, maxY };
  };
  /**
   * calculate the euclidean distance form p1 to p2
   * @param p1
   * @param p2
   * @returns
   */
  const getEuclideanDistance = (p1, p2) => Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
  /**
   * Depth first search begin from nodes in graphCore data.
   * @param graphCore graphlib data structure
   * @param nodes begin nodes
   * @param fn will be called while visiting each node
   * @param mode 'TB' - visit from top to bottom; 'BT' - visit from bottom to top;
   * @returns
   */
  const graphTreeDfs = (graph, nodes, fn, mode = 'TB', treeKey, stopFns = {}) => {
      if (!(nodes === null || nodes === void 0 ? void 0 : nodes.length))
          return;
      const { stopBranchFn, stopAllFn } = stopFns;
      for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          if (!graph.hasNode(node.id))
              continue;
          if (stopBranchFn === null || stopBranchFn === void 0 ? void 0 : stopBranchFn(node))
              continue; // Stop this branch
          if (stopAllFn === null || stopAllFn === void 0 ? void 0 : stopAllFn(node))
              return; // Stop all
          if (mode === 'TB')
              fn(node); // Traverse from top to bottom
          graphTreeDfs(graph, graph.getChildren(node.id, treeKey), fn, mode, treeKey, stopFns);
          if (mode !== 'TB')
              fn(node); // Traverse from bottom to top
      }
  };

  const clone = (target) => {
      if (target === null) {
          return target;
      }
      if (target instanceof Date) {
          return new Date(target.getTime());
      }
      if (target instanceof Array) {
          const cp = [];
          target.forEach((v) => {
              cp.push(v);
          });
          return cp.map((n) => clone(n));
      }
      if (typeof target === 'object') {
          const cp = {};
          Object.keys(target).forEach((k) => {
              cp[k] = clone(target[k]);
          });
          return cp;
      }
      return target;
  };
  /**
   * Clone node or edge data and format it
   * @param target node/edge to be cloned
   * @param initRange whether init the x and y in data with the range, which means [xRange, yRange]
   * @returns cloned node/edge
   */
  const cloneFormatData = (target, initRange) => {
      const cloned = clone(target);
      cloned.data = cloned.data || {};
      if (initRange) {
          if (!isNumber(cloned.data.x))
              cloned.data.x = Math.random() * initRange[0];
          if (!isNumber(cloned.data.y))
              cloned.data.y = Math.random() * initRange[1];
      }
      return cloned;
  };

  function parseSize(size) {
      if (!size)
          return [0, 0, 0];
      if (isNumber(size))
          return [size, size, size];
      else if (size.length === 0)
          return [0, 0, 0];
      const [x, y = x, z = x] = size;
      return [x, y, z];
  }

  /**
   * Format value with multiple types into a function returns number.
   * @param defaultValue default value when value is invalid
   * @param value value to be formatted
   * @returns formatted result, a function returns number
   */
  function formatNumberFn(defaultValue, value) {
      let resultFunc;
      if (isFunction(value)) {
          resultFunc = value;
      }
      else if (isNumber(value)) {
          // value is number
          resultFunc = () => value;
      }
      else {
          // value is not number and function
          resultFunc = () => defaultValue;
      }
      return resultFunc;
  }
  /**
   * Format size config with multiple types into a function returns number
   * @param defaultValue default value when value is invalid
   * @param value value to be formatted
   * @param resultIsNumber whether returns number
   * @returns formatted result, a function returns number
   */
  function formatSizeFn(defaultValue, value, resultIsNumber = true) {
      if (!value && value !== 0) {
          return (d) => {
              const { size } = d.data || {};
              if (size) {
                  if (Array.isArray(size))
                      return resultIsNumber ? Math.max(...size) || defaultValue : size;
                  if (isObject(size) &&
                      size.width &&
                      size.height) {
                      return resultIsNumber
                          ? Math.max(size.width, size.height) || defaultValue
                          : [size.width, size.height];
                  }
                  return size;
              }
              return defaultValue;
          };
      }
      if (isFunction(value))
          return value;
      if (isNumber(value))
          return () => value;
      if (Array.isArray(value)) {
          return () => {
              if (resultIsNumber)
                  return Math.max(...value) || defaultValue;
              return value;
          };
      }
      if (isObject(value) && value.width && value.height) {
          return () => {
              if (resultIsNumber)
                  return Math.max(value.width, value.height) || defaultValue;
              return [value.width, value.height];
          };
      }
      return () => defaultValue;
  }
  /**
   * format the props nodeSize and nodeSpacing to a function
   * @param nodeSize
   * @param nodeSpacing
   * @returns
   */
  const formatNodeSizeToNumber = (nodeSize, nodeSpacing, defaultNodeSize = 10) => {
      let nodeSizeFunc;
      const nodeSpacingFunc = typeof nodeSpacing === 'function' ? nodeSpacing : () => nodeSpacing || 0;
      if (!nodeSize) {
          nodeSizeFunc = (d) => {
              var _a, _b, _c;
              if ((_a = d.data) === null || _a === void 0 ? void 0 : _a.bboxSize)
                  return (_b = d.data) === null || _b === void 0 ? void 0 : _b.bboxSize;
              if ((_c = d.data) === null || _c === void 0 ? void 0 : _c.size) {
                  const dataSize = d.data.size;
                  if (Array.isArray(dataSize))
                      return dataSize;
                  if (isObject(dataSize))
                      return [dataSize.width, dataSize.height];
                  return dataSize;
              }
              return defaultNodeSize;
          };
      }
      else if (Array.isArray(nodeSize)) {
          nodeSizeFunc = (d) => nodeSize;
      }
      else if (isFunction(nodeSize)) {
          nodeSizeFunc = nodeSize;
      }
      else {
          nodeSizeFunc = (d) => nodeSize;
      }
      const func = (d) => {
          const nodeSize = nodeSizeFunc(d);
          const nodeSpacing = nodeSpacingFunc(d);
          return Math.max(...parseSize(nodeSize)) + nodeSpacing;
      };
      return func;
  };

  const DEFAULTS_LAYOUT_OPTIONS$b = {
      rankdir: 'TB',
      nodesep: 50,
      ranksep: 50,
      edgeLabelSpace: true,
      ranker: 'tight-tree',
      controlPoints: false,
      radial: false,
      focusNode: null, // radial 为 true 时生效，关注的节点
  };
  /**
   * <zh/> AntV 实现的 Dagre 布局
   *
   * <en/> AntV implementation of Dagre layout
   */
  class AntVDagreLayout {
      constructor(options = {}) {
          this.options = options;
          this.id = 'antv-dagre';
          this.options = Object.assign(Object.assign({}, DEFAULTS_LAYOUT_OPTIONS$b), options);
      }
      /**
       * Return the positions of nodes and edges(if needed).
       */
      execute(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              return this.genericDagreLayout(false, graph, options);
          });
      }
      /**
       * To directly assign the positions to the nodes.
       */
      assign(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              yield this.genericDagreLayout(true, graph, options);
          });
      }
      genericDagreLayout(assign, graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              const mergedOptions = Object.assign(Object.assign({}, this.options), options);
              const { nodeSize, align, rankdir = 'TB', ranksep, nodesep, ranksepFunc, nodesepFunc, edgeLabelSpace, ranker, nodeOrder, begin, controlPoints, radial, sortByCombo, 
              // focusNode,
              preset, } = mergedOptions;
              const g = new Graph({
                  tree: [],
              });
              const ranksepfunc = formatNumberFn(ranksep || 50, ranksepFunc);
              const nodesepfunc = formatNumberFn(nodesep || 50, nodesepFunc);
              let horisep = nodesepfunc;
              let vertisep = ranksepfunc;
              if (rankdir === 'LR' || rankdir === 'RL') {
                  horisep = ranksepfunc;
                  vertisep = nodesepfunc;
              }
              const nodeSizeFunc = formatSizeFn(10, nodeSize, false);
              // copy graph to g
              const nodes = graph.getAllNodes();
              const edges = graph.getAllEdges();
              nodes.forEach((node) => {
                  const size = parseSize(nodeSizeFunc(node));
                  const verti = vertisep(node);
                  const hori = horisep(node);
                  const width = size[0] + 2 * hori;
                  const height = size[1] + 2 * verti;
                  const layer = node.data.layer;
                  if (isNumber(layer)) {
                      // 如果有layer属性，加入到node的label中
                      g.addNode({
                          id: node.id,
                          data: { width, height, layer },
                      });
                  }
                  else {
                      g.addNode({
                          id: node.id,
                          data: { width, height },
                      });
                  }
              });
              if (sortByCombo) {
                  g.attachTreeStructure('combo');
                  nodes.forEach((node) => {
                      const { parentId } = node.data;
                      if (parentId === undefined)
                          return;
                      if (g.hasNode(parentId)) {
                          g.setParent(node.id, parentId, 'combo');
                      }
                  });
              }
              edges.forEach((edge) => {
                  // dagrejs Wiki https://github.com/dagrejs/dagre/wiki#configuring-the-layout
                  g.addEdge({
                      id: edge.id,
                      source: edge.source,
                      target: edge.target,
                      data: {
                          weight: edge.data.weight || 1,
                      },
                  });
              });
              let prevGraph = undefined;
              if (preset === null || preset === void 0 ? void 0 : preset.length) {
                  prevGraph = new Graph({
                      nodes: preset,
                  });
              }
              layout(g, {
                  prevGraph,
                  edgeLabelSpace,
                  keepNodeOrder: !!nodeOrder,
                  nodeOrder: nodeOrder || [],
                  acyclicer: 'greedy',
                  ranker,
                  rankdir,
                  nodesep,
                  align,
              });
              const layoutTopLeft = [0, 0];
              if (begin) {
                  let minX = Infinity;
                  let minY = Infinity;
                  g.getAllNodes().forEach((node) => {
                      if (minX > node.data.x)
                          minX = node.data.x;
                      if (minY > node.data.y)
                          minY = node.data.y;
                  });
                  g.getAllEdges().forEach((edge) => {
                      var _a;
                      (_a = edge.data.points) === null || _a === void 0 ? void 0 : _a.forEach((point) => {
                          if (minX > point.x)
                              minX = point.x;
                          if (minY > point.y)
                              minY = point.y;
                      });
                  });
                  layoutTopLeft[0] = begin[0] - minX;
                  layoutTopLeft[1] = begin[1] - minY;
              }
              const isHorizontal = rankdir === 'LR' || rankdir === 'RL';
              if (radial) ;
              else {
                  const layerCoords = new Set();
                  const isInvert = rankdir === 'BT' || rankdir === 'RL';
                  const layerCoordSort = isInvert
                      ? (a, b) => b - a
                      : (a, b) => a - b;
                  g.getAllNodes().forEach((node) => {
                      // let ndata: any = this.nodeMap[node];
                      // if (!ndata) {
                      //   ndata = combos?.find((it) => it.id === node);
                      // }
                      // if (!ndata) return;
                      // ndata.x = node.data.x! + dBegin[0];
                      // ndata.y = node.data.y! + dBegin[1];
                      // //  pass layer order to data for increment layout use
                      // ndata._order = node.data._order;
                      // layerCoords.add(isHorizontal ? ndata.x : ndata.y);
                      node.data.x = node.data.x + layoutTopLeft[0];
                      node.data.y = node.data.y + layoutTopLeft[1];
                      layerCoords.add(isHorizontal ? node.data.x : node.data.y);
                  });
                  const layerCoordsArr = Array.from(layerCoords).sort(layerCoordSort);
                  // pre-define the isHorizontal related functions to avoid redundant calc in interations
                  const isDifferentLayer = isHorizontal
                      ? (point1, point2) => point1.x !== point2.x
                      : (point1, point2) => point1.y !== point2.y;
                  const filterControlPointsOutOfBoundary = isHorizontal
                      ? (ps, point1, point2) => {
                          const max = Math.max(point1.y, point2.y);
                          const min = Math.min(point1.y, point2.y);
                          return ps.filter((point) => point.y <= max && point.y >= min);
                      }
                      : (ps, point1, point2) => {
                          const max = Math.max(point1.x, point2.x);
                          const min = Math.min(point1.x, point2.x);
                          return ps.filter((point) => point.x <= max && point.x >= min);
                      };
                  g.getAllEdges().forEach((edge, i) => {
                      var _a;
                      // const i = edges.findIndex((it) => {
                      //   return it.source === edge.source && it.target === edge.target;
                      // });
                      // if (i <= -1) return;
                      if (edgeLabelSpace && controlPoints && edge.data.type !== 'loop') {
                          edge.data.controlPoints = getControlPoints((_a = edge.data.points) === null || _a === void 0 ? void 0 : _a.map(({ x, y }) => ({
                              x: x + layoutTopLeft[0],
                              y: y + layoutTopLeft[1],
                          })), g.getNode(edge.source), g.getNode(edge.target), layerCoordsArr, isHorizontal, isDifferentLayer, filterControlPointsOutOfBoundary);
                      }
                  });
              }
              // calculated nodes as temporary result
              let layoutNodes = [];
              // layout according to the original order in the data.nodes
              layoutNodes = g
                  .getAllNodes()
                  .map((node) => cloneFormatData(node));
              const layoutEdges = g.getAllEdges();
              if (assign) {
                  layoutNodes.forEach((node) => {
                      graph.mergeNodeData(node.id, {
                          x: node.data.x,
                          y: node.data.y,
                      });
                  });
                  layoutEdges.forEach((edge) => {
                      graph.mergeEdgeData(edge.id, {
                          controlPoints: edge.data.controlPoints,
                      });
                  });
              }
              const result = {
                  nodes: layoutNodes,
                  edges: layoutEdges,
              };
              return result;
          });
      }
  }
  /**
   * Format controlPoints to avoid polylines crossing nodes
   * @param points
   * @param sourceNode
   * @param targetNode
   * @param layerCoordsArr
   * @param isHorizontal
   * @returns
   */
  const getControlPoints = (points, sourceNode, targetNode, layerCoordsArr, isHorizontal, isDifferentLayer, filterControlPointsOutOfBoundary) => {
      let controlPoints = (points === null || points === void 0 ? void 0 : points.slice(1, points.length - 1)) || []; // 去掉头尾
      // 酌情增加控制点，使折线不穿过跨层的节点
      if (sourceNode && targetNode) {
          let { x: sourceX, y: sourceY } = sourceNode.data;
          let { x: targetX, y: targetY } = targetNode.data;
          if (isHorizontal) {
              sourceX = sourceNode.data.y;
              sourceY = sourceNode.data.x;
              targetX = targetNode.data.y;
              targetY = targetNode.data.x;
          }
          // 为跨层级的边增加第一个控制点。忽略垂直的/横向的边。
          // 新控制点 = {
          //   x: 终点x,
          //   y: (起点y + 下一层y) / 2,   #下一层y可能不等于终点y
          // }
          if (targetY !== sourceY && sourceX !== targetX) {
              const sourceLayer = layerCoordsArr.indexOf(sourceY);
              const sourceNextLayerCoord = layerCoordsArr[sourceLayer + 1];
              if (sourceNextLayerCoord) {
                  const firstControlPoint = controlPoints[0];
                  const insertStartControlPoint = (isHorizontal
                      ? {
                          x: (sourceY + sourceNextLayerCoord) / 2,
                          y: (firstControlPoint === null || firstControlPoint === void 0 ? void 0 : firstControlPoint.y) || targetX,
                      }
                      : {
                          x: (firstControlPoint === null || firstControlPoint === void 0 ? void 0 : firstControlPoint.x) || targetX,
                          y: (sourceY + sourceNextLayerCoord) / 2,
                      });
                  // 当新增的控制点不存在（!=当前第一个控制点）时添加
                  if (!firstControlPoint ||
                      isDifferentLayer(firstControlPoint, insertStartControlPoint)) {
                      controlPoints.unshift(insertStartControlPoint);
                  }
              }
              const targetLayer = layerCoordsArr.indexOf(targetY);
              const layerDiff = Math.abs(targetLayer - sourceLayer);
              if (layerDiff === 1) {
                  controlPoints = filterControlPointsOutOfBoundary(controlPoints, sourceNode.data, targetNode.data);
                  // one controlPoint at least
                  if (!controlPoints.length) {
                      controlPoints.push((isHorizontal
                          ? {
                              x: (sourceY + targetY) / 2,
                              y: sourceX,
                          }
                          : {
                              x: sourceX,
                              y: (sourceY + targetY) / 2,
                          }));
                  }
              }
              else if (layerDiff > 1) {
                  const targetLastLayerCoord = layerCoordsArr[targetLayer - 1];
                  if (targetLastLayerCoord) {
                      const lastControlPoints = controlPoints[controlPoints.length - 1];
                      const insertEndControlPoint = (isHorizontal
                          ? {
                              x: (targetY + targetLastLayerCoord) / 2,
                              y: (lastControlPoints === null || lastControlPoints === void 0 ? void 0 : lastControlPoints.y) || targetX,
                          }
                          : {
                              x: (lastControlPoints === null || lastControlPoints === void 0 ? void 0 : lastControlPoints.x) || sourceX,
                              y: (targetY + targetLastLayerCoord) / 2,
                          });
                      // 当新增的控制点不存在（!=当前最后一个控制点）时添加
                      if (!lastControlPoints ||
                          isDifferentLayer(lastControlPoints, insertEndControlPoint)) {
                          controlPoints.push(insertEndControlPoint);
                      }
                  }
              }
          }
      }
      return controlPoints;
  };

  /**
   * Assign or only return the result for the graph who has no nodes or only one node.
   * @param graph original graph
   * @param assign whether assign result to original graph
   * @param center the layout center
   * @returns
   */
  const handleSingleNodeGraph = (graph, assign, center) => {
      const nodes = graph.getAllNodes();
      const edges = graph.getAllEdges();
      if (!(nodes === null || nodes === void 0 ? void 0 : nodes.length)) {
          const result = { nodes: [], edges };
          return result;
      }
      if (nodes.length === 1) {
          if (assign) {
              graph.mergeNodeData(nodes[0].id, {
                  x: center[0],
                  y: center[1],
              });
          }
          const result = {
              nodes: [
                  Object.assign(Object.assign({}, nodes[0]), { data: Object.assign(Object.assign({}, nodes[0].data), { x: center[0], y: center[1] }) }),
              ],
              edges,
          };
          return result;
      }
  };

  const DEFAULTS_LAYOUT_OPTIONS$a = {
      radius: null,
      startRadius: null,
      endRadius: null,
      startAngle: 0,
      endAngle: 2 * Math.PI,
      clockwise: true,
      divisions: 1,
      ordering: null,
      angleRatio: 1,
  };
  /**
   * <zh/> 环形布局
   *
   * <en/> Circular layout
   */
  class CircularLayout {
      constructor(options = {}) {
          this.options = options;
          this.id = 'circular';
          this.options = Object.assign(Object.assign({}, DEFAULTS_LAYOUT_OPTIONS$a), options);
      }
      /**
       * Return the positions of nodes and edges(if needed).
       */
      execute(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              return this.genericCircularLayout(false, graph, options);
          });
      }
      /**
       * To directly assign the positions to the nodes.
       */
      assign(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              yield this.genericCircularLayout(true, graph, options);
          });
      }
      genericCircularLayout(assign, graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              const mergedOptions = Object.assign(Object.assign({}, this.options), options);
              const { width, height, center, divisions, startAngle = 0, endAngle = 2 * Math.PI, angleRatio, ordering, clockwise, nodeSpacing: paramNodeSpacing, nodeSize: paramNodeSize, } = mergedOptions;
              const nodes = graph.getAllNodes();
              const edges = graph.getAllEdges();
              // Calculate center according to `window` if not provided.
              const [calculatedWidth, calculatedHeight, calculatedCenter] = calculateCenter(width, height, center);
              const n = nodes === null || nodes === void 0 ? void 0 : nodes.length;
              if (!n || n === 1) {
                  return handleSingleNodeGraph(graph, assign, calculatedCenter);
              }
              const angleStep = (endAngle - startAngle) / n;
              let { radius, startRadius, endRadius } = mergedOptions;
              if (paramNodeSpacing) {
                  const nodeSpacing = formatNumberFn(10, paramNodeSpacing);
                  const nodeSize = formatSizeFn(10, paramNodeSize);
                  let maxNodeSize = -Infinity;
                  nodes.forEach((node) => {
                      const nSize = nodeSize(node);
                      if (maxNodeSize < nSize)
                          maxNodeSize = nSize;
                  });
                  let perimeter = 0;
                  nodes.forEach((node, i) => {
                      if (i === 0)
                          perimeter += maxNodeSize || 10;
                      else
                          perimeter += (nodeSpacing(node) || 0) + (maxNodeSize || 10);
                  });
                  radius = perimeter / (2 * Math.PI);
              }
              else if (!radius && !startRadius && !endRadius) {
                  radius = Math.min(calculatedHeight, calculatedWidth) / 2;
              }
              else if (!startRadius && endRadius) {
                  startRadius = endRadius;
              }
              else if (startRadius && !endRadius) {
                  endRadius = startRadius;
              }
              const astep = angleStep * angleRatio;
              // calculated nodes as temporary result
              let layoutNodes = [];
              if (ordering === 'topology') {
                  // layout according to the topology
                  layoutNodes = topologyOrdering(graph, nodes);
              }
              else if (ordering === 'topology-directed') {
                  // layout according to the topology
                  layoutNodes = topologyOrdering(graph, nodes, true);
              }
              else if (ordering === 'degree') {
                  // layout according to the descent order of degrees
                  layoutNodes = degreeOrdering(graph, nodes);
              }
              else {
                  // layout according to the original order in the data.nodes
                  layoutNodes = nodes.map((node) => cloneFormatData(node));
              }
              const divN = Math.ceil(n / divisions); // node number in each division
              for (let i = 0; i < n; ++i) {
                  let r = radius;
                  if (!r && startRadius !== null && endRadius !== null) {
                      r = startRadius + (i * (endRadius - startRadius)) / (n - 1);
                  }
                  if (!r) {
                      r = 10 + (i * 100) / (n - 1);
                  }
                  let angle = startAngle +
                      (i % divN) * astep +
                      ((2 * Math.PI) / divisions) * Math.floor(i / divN);
                  if (!clockwise) {
                      angle =
                          endAngle -
                              (i % divN) * astep -
                              ((2 * Math.PI) / divisions) * Math.floor(i / divN);
                  }
                  layoutNodes[i].data.x = calculatedCenter[0] + Math.cos(angle) * r;
                  layoutNodes[i].data.y = calculatedCenter[1] + Math.sin(angle) * r;
              }
              if (assign) {
                  layoutNodes.forEach((node) => {
                      graph.mergeNodeData(node.id, {
                          x: node.data.x,
                          y: node.data.y,
                      });
                  });
              }
              const result = {
                  nodes: layoutNodes,
                  edges,
              };
              return result;
          });
      }
  }
  /**
   * order the nodes acoording to the graph topology
   * @param graph
   * @param nodes
   * @param directed
   * @returns
   */
  const topologyOrdering = (graph, nodes, directed = false) => {
      const orderedCNodes = [cloneFormatData(nodes[0])];
      const pickFlags = {};
      const n = nodes.length;
      pickFlags[nodes[0].id] = true;
      // write children into cnodes
      let k = 0;
      nodes.forEach((node, i) => {
          if (i !== 0) {
              if ((i === n - 1 ||
                  graph.getDegree(node.id, 'both') !==
                      graph.getDegree(nodes[i + 1].id, 'both') ||
                  graph.areNeighbors(orderedCNodes[k].id, node.id)) &&
                  !pickFlags[node.id]) {
                  orderedCNodes.push(cloneFormatData(node));
                  pickFlags[node.id] = true;
                  k++;
              }
              else {
                  const children = directed
                      ? graph.getSuccessors(orderedCNodes[k].id)
                      : graph.getNeighbors(orderedCNodes[k].id);
                  let foundChild = false;
                  for (let j = 0; j < children.length; j++) {
                      const child = children[j];
                      if (graph.getDegree(child.id) === graph.getDegree(node.id) &&
                          !pickFlags[child.id]) {
                          orderedCNodes.push(cloneFormatData(child));
                          pickFlags[child.id] = true;
                          foundChild = true;
                          break;
                      }
                  }
                  let ii = 0;
                  while (!foundChild) {
                      if (!pickFlags[nodes[ii].id]) {
                          orderedCNodes.push(cloneFormatData(nodes[ii]));
                          pickFlags[nodes[ii].id] = true;
                          foundChild = true;
                      }
                      ii++;
                      if (ii === n) {
                          break;
                      }
                  }
              }
          }
      });
      return orderedCNodes;
  };
  /**
   * order the nodes according to their degree
   * @param graph
   * @param nodes
   * @returns
   */
  function degreeOrdering(graph, nodes) {
      const orderedNodes = [];
      nodes.forEach((node, i) => {
          orderedNodes.push(cloneFormatData(node));
      });
      orderedNodes.sort((nodeA, nodeB) => graph.getDegree(nodeA.id, 'both') - graph.getDegree(nodeB.id, 'both'));
      return orderedNodes;
  }
  /**
   * format the invalide width and height, and get the center position
   * @param width
   * @param height
   * @param center
   * @returns
   */
  const calculateCenter = (width, height, center) => {
      let calculatedWidth = width;
      let calculatedHeight = height;
      let calculatedCenter = center;
      if (!calculatedWidth && typeof window !== 'undefined') {
          calculatedWidth = window.innerWidth;
      }
      if (!calculatedHeight && typeof window !== 'undefined') {
          calculatedHeight = window.innerHeight;
      }
      if (!calculatedCenter) {
          calculatedCenter = [calculatedWidth / 2, calculatedHeight / 2];
      }
      return [calculatedWidth, calculatedHeight, calculatedCenter];
  };

  const DEFAULTS_LAYOUT_OPTIONS$9 = {
      nodeSize: 30,
      nodeSpacing: 10,
      preventOverlap: false,
      sweep: undefined,
      equidistant: false,
      startAngle: (3 / 2) * Math.PI,
      clockwise: true,
      maxLevelDiff: undefined,
      sortBy: 'degree',
  };
  /**
   * <zh/> 同心圆布局
   *
   * <en/> Concentric layout
   */
  class ConcentricLayout {
      constructor(options = {}) {
          this.options = options;
          this.id = 'concentric';
          this.options = Object.assign(Object.assign({}, DEFAULTS_LAYOUT_OPTIONS$9), options);
      }
      /**
       * Return the positions of nodes and edges(if needed).
       */
      execute(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              return this.genericConcentricLayout(false, graph, options);
          });
      }
      /**
       * To directly assign the positions to the nodes.
       */
      assign(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              yield this.genericConcentricLayout(true, graph, options);
          });
      }
      genericConcentricLayout(assign, graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              const mergedOptions = Object.assign(Object.assign({}, this.options), options);
              const { center: propsCenter, width: propsWidth, height: propsHeight, sortBy: propsSortBy, maxLevelDiff: propsMaxLevelDiff, sweep: propsSweep, clockwise, equidistant, preventOverlap, startAngle = (3 / 2) * Math.PI, nodeSize, nodeSpacing, } = mergedOptions;
              const nodes = graph.getAllNodes();
              const edges = graph.getAllEdges();
              const width = !propsWidth && typeof window !== 'undefined'
                  ? window.innerWidth
                  : propsWidth;
              const height = !propsHeight && typeof window !== 'undefined'
                  ? window.innerHeight
                  : propsHeight;
              const center = (!propsCenter ? [width / 2, height / 2] : propsCenter);
              if (!(nodes === null || nodes === void 0 ? void 0 : nodes.length) || nodes.length === 1) {
                  return handleSingleNodeGraph(graph, assign, center);
              }
              const layoutNodes = [];
              let maxNodeSize;
              let maxNodeSpacing = 0;
              if (isArray(nodeSize)) {
                  maxNodeSize = Math.max(nodeSize[0], nodeSize[1]);
              }
              else if (isFunction(nodeSize)) {
                  maxNodeSize = -Infinity;
                  nodes.forEach((node) => {
                      const currentSize = Math.max(...parseSize(nodeSize(node)));
                      if (currentSize > maxNodeSize)
                          maxNodeSize = currentSize;
                  });
              }
              else {
                  maxNodeSize = nodeSize;
              }
              if (isArray(nodeSpacing)) {
                  maxNodeSpacing = Math.max(nodeSpacing[0], nodeSpacing[1]);
              }
              else if (isNumber(nodeSpacing)) {
                  maxNodeSpacing = nodeSpacing;
              }
              nodes.forEach((node) => {
                  const cnode = cloneFormatData(node);
                  layoutNodes.push(cnode);
                  let nodeSize = maxNodeSize;
                  const { data } = cnode;
                  if (isArray(data.size)) {
                      nodeSize = Math.max(data.size[0], data.size[1]);
                  }
                  else if (isNumber(data.size)) {
                      nodeSize = data.size;
                  }
                  else if (isObject(data.size)) {
                      nodeSize = Math.max(data.size.width, data.size.height);
                  }
                  maxNodeSize = Math.max(maxNodeSize, nodeSize);
                  if (isFunction(nodeSpacing)) {
                      maxNodeSpacing = Math.max(nodeSpacing(node), maxNodeSpacing);
                  }
              });
              // layout
              const nodeIdxMap = {};
              layoutNodes.forEach((node, i) => {
                  nodeIdxMap[node.id] = i;
              });
              // get the node degrees
              let sortBy = propsSortBy;
              if (!isString(sortBy) ||
                  layoutNodes[0].data[sortBy] === undefined) {
                  sortBy = 'degree';
              }
              if (sortBy === 'degree') {
                  layoutNodes.sort((n1, n2) => graph.getDegree(n2.id, 'both') - graph.getDegree(n1.id, 'both'));
              }
              else {
                  // sort nodes by value
                  layoutNodes.sort((n1, n2) => n2.data[sortBy] - n1.data[sortBy]);
              }
              const maxValueNode = layoutNodes[0];
              const maxLevelDiff = (propsMaxLevelDiff ||
                  (sortBy === 'degree'
                      ? graph.getDegree(maxValueNode.id, 'both')
                      : maxValueNode.data[sortBy])) / 4;
              // put the values into levels
              const levels = [{ nodes: [] }];
              let currentLevel = levels[0];
              layoutNodes.forEach((node) => {
                  if (currentLevel.nodes.length > 0) {
                      const diff = sortBy === 'degree'
                          ? Math.abs(graph.getDegree(currentLevel.nodes[0].id, 'both') -
                              graph.getDegree(node.id, 'both'))
                          : Math.abs(currentLevel.nodes[0].data[sortBy] -
                              node.data[sortBy]);
                      if (maxLevelDiff && diff >= maxLevelDiff) {
                          currentLevel = { nodes: [] };
                          levels.push(currentLevel);
                      }
                  }
                  currentLevel.nodes.push(node);
              });
              // create positions for levels
              let minDist = maxNodeSize + maxNodeSpacing; // min dist between nodes
              if (!preventOverlap) {
                  // then strictly constrain to bb
                  const firstLvlHasMulti = levels.length > 0 && levels[0].nodes.length > 1;
                  const maxR = Math.min(width, height) / 2 - minDist;
                  const rStep = maxR / (levels.length + (firstLvlHasMulti ? 1 : 0));
                  minDist = Math.min(minDist, rStep);
              }
              // find the metrics for each level
              let r = 0;
              levels.forEach((level) => {
                  const sweep = propsSweep === undefined
                      ? 2 * Math.PI - (2 * Math.PI) / level.nodes.length
                      : propsSweep;
                  level.dTheta = sweep / Math.max(1, level.nodes.length - 1);
                  // calculate the radius
                  if (level.nodes.length > 1 && preventOverlap) {
                      // but only if more than one node (can't overlap)
                      const dcos = Math.cos(level.dTheta) - Math.cos(0);
                      const dsin = Math.sin(level.dTheta) - Math.sin(0);
                      const rMin = Math.sqrt((minDist * minDist) / (dcos * dcos + dsin * dsin)); // s.t. no nodes overlapping
                      r = Math.max(rMin, r);
                  }
                  level.r = r;
                  r += minDist;
              });
              if (equidistant) {
                  let rDeltaMax = 0;
                  let rr = 0;
                  for (let i = 0; i < levels.length; i++) {
                      const level = levels[i];
                      const rDelta = (level.r || 0) - rr;
                      rDeltaMax = Math.max(rDeltaMax, rDelta);
                  }
                  rr = 0;
                  levels.forEach((level, i) => {
                      if (i === 0) {
                          rr = level.r || 0;
                      }
                      level.r = rr;
                      rr += rDeltaMax;
                  });
              }
              // calculate the node positions
              levels.forEach((level) => {
                  const dTheta = level.dTheta || 0;
                  const rr = level.r || 0;
                  level.nodes.forEach((node, j) => {
                      const theta = startAngle + (clockwise ? 1 : -1) * dTheta * j;
                      node.data.x = center[0] + rr * Math.cos(theta);
                      node.data.y = center[1] + rr * Math.sin(theta);
                  });
              });
              if (assign) {
                  layoutNodes.forEach((node) => graph.mergeNodeData(node.id, {
                      x: node.data.x,
                      y: node.data.y,
                  }));
              }
              const result = {
                  nodes: layoutNodes,
                  edges,
              };
              return result;
          });
      }
  }

  function tree_add$2(d) {
    const x = +this._x.call(null, d),
        y = +this._y.call(null, d);
    return add$2(this.cover(x, y), x, y, d);
  }

  function add$2(tree, x, y, d) {
    if (isNaN(x) || isNaN(y)) return tree; // ignore invalid points

    var parent,
        node = tree._root,
        leaf = {data: d},
        x0 = tree._x0,
        y0 = tree._y0,
        x1 = tree._x1,
        y1 = tree._y1,
        xm,
        ym,
        xp,
        yp,
        right,
        bottom,
        i,
        j;

    // If the tree is empty, initialize the root as a leaf.
    if (!node) return tree._root = leaf, tree;

    // Find the existing leaf for the new point, or add it.
    while (node.length) {
      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
      if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
      if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
    }

    // Is the new point is exactly coincident with the existing point?
    xp = +tree._x.call(null, node.data);
    yp = +tree._y.call(null, node.data);
    if (x === xp && y === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;

    // Otherwise, split the leaf node until the old and new point are separated.
    do {
      parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
      if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
    } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | (xp >= xm)));
    return parent[j] = node, parent[i] = leaf, tree;
  }

  function addAll$2(data) {
    var d, i, n = data.length,
        x,
        y,
        xz = new Array(n),
        yz = new Array(n),
        x0 = Infinity,
        y0 = Infinity,
        x1 = -Infinity,
        y1 = -Infinity;

    // Compute the points and their extent.
    for (i = 0; i < n; ++i) {
      if (isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d))) continue;
      xz[i] = x;
      yz[i] = y;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }

    // If there were no (valid) points, abort.
    if (x0 > x1 || y0 > y1) return this;

    // Expand the tree to cover the new points.
    this.cover(x0, y0).cover(x1, y1);

    // Add the new points.
    for (i = 0; i < n; ++i) {
      add$2(this, xz[i], yz[i], data[i]);
    }

    return this;
  }

  function tree_cover$2(x, y) {
    if (isNaN(x = +x) || isNaN(y = +y)) return this; // ignore invalid points

    var x0 = this._x0,
        y0 = this._y0,
        x1 = this._x1,
        y1 = this._y1;

    // If the quadtree has no extent, initialize them.
    // Integer extent are necessary so that if we later double the extent,
    // the existing quadrant boundaries don’t change due to floating point error!
    if (isNaN(x0)) {
      x1 = (x0 = Math.floor(x)) + 1;
      y1 = (y0 = Math.floor(y)) + 1;
    }

    // Otherwise, double repeatedly to cover.
    else {
      var z = x1 - x0 || 1,
          node = this._root,
          parent,
          i;

      while (x0 > x || x >= x1 || y0 > y || y >= y1) {
        i = (y < y0) << 1 | (x < x0);
        parent = new Array(4), parent[i] = node, node = parent, z *= 2;
        switch (i) {
          case 0: x1 = x0 + z, y1 = y0 + z; break;
          case 1: x0 = x1 - z, y1 = y0 + z; break;
          case 2: x1 = x0 + z, y0 = y1 - z; break;
          case 3: x0 = x1 - z, y0 = y1 - z; break;
        }
      }

      if (this._root && this._root.length) this._root = node;
    }

    this._x0 = x0;
    this._y0 = y0;
    this._x1 = x1;
    this._y1 = y1;
    return this;
  }

  function tree_data$2() {
    var data = [];
    this.visit(function(node) {
      if (!node.length) do data.push(node.data); while (node = node.next)
    });
    return data;
  }

  function tree_extent$2(_) {
    return arguments.length
        ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1])
        : isNaN(this._x0) ? undefined : [[this._x0, this._y0], [this._x1, this._y1]];
  }

  function Quad$1(node, x0, y0, x1, y1) {
    this.node = node;
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
  }

  function tree_find$2(x, y, radius) {
    var data,
        x0 = this._x0,
        y0 = this._y0,
        x1,
        y1,
        x2,
        y2,
        x3 = this._x1,
        y3 = this._y1,
        quads = [],
        node = this._root,
        q,
        i;

    if (node) quads.push(new Quad$1(node, x0, y0, x3, y3));
    if (radius == null) radius = Infinity;
    else {
      x0 = x - radius, y0 = y - radius;
      x3 = x + radius, y3 = y + radius;
      radius *= radius;
    }

    while (q = quads.pop()) {

      // Stop searching if this quadrant can’t contain a closer node.
      if (!(node = q.node)
          || (x1 = q.x0) > x3
          || (y1 = q.y0) > y3
          || (x2 = q.x1) < x0
          || (y2 = q.y1) < y0) continue;

      // Bisect the current quadrant.
      if (node.length) {
        var xm = (x1 + x2) / 2,
            ym = (y1 + y2) / 2;

        quads.push(
          new Quad$1(node[3], xm, ym, x2, y2),
          new Quad$1(node[2], x1, ym, xm, y2),
          new Quad$1(node[1], xm, y1, x2, ym),
          new Quad$1(node[0], x1, y1, xm, ym)
        );

        // Visit the closest quadrant first.
        if (i = (y >= ym) << 1 | (x >= xm)) {
          q = quads[quads.length - 1];
          quads[quads.length - 1] = quads[quads.length - 1 - i];
          quads[quads.length - 1 - i] = q;
        }
      }

      // Visit this point. (Visiting coincident points isn’t necessary!)
      else {
        var dx = x - +this._x.call(null, node.data),
            dy = y - +this._y.call(null, node.data),
            d2 = dx * dx + dy * dy;
        if (d2 < radius) {
          var d = Math.sqrt(radius = d2);
          x0 = x - d, y0 = y - d;
          x3 = x + d, y3 = y + d;
          data = node.data;
        }
      }
    }

    return data;
  }

  function tree_remove$2(d) {
    if (isNaN(x = +this._x.call(null, d)) || isNaN(y = +this._y.call(null, d))) return this; // ignore invalid points

    var parent,
        node = this._root,
        retainer,
        previous,
        next,
        x0 = this._x0,
        y0 = this._y0,
        x1 = this._x1,
        y1 = this._y1,
        x,
        y,
        xm,
        ym,
        right,
        bottom,
        i,
        j;

    // If the tree is empty, initialize the root as a leaf.
    if (!node) return this;

    // Find the leaf node for the point.
    // While descending, also retain the deepest parent with a non-removed sibling.
    if (node.length) while (true) {
      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
      if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
      if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
      if (!node.length) break;
      if (parent[(i + 1) & 3] || parent[(i + 2) & 3] || parent[(i + 3) & 3]) retainer = parent, j = i;
    }

    // Find the point to remove.
    while (node.data !== d) if (!(previous = node, node = node.next)) return this;
    if (next = node.next) delete node.next;

    // If there are multiple coincident points, remove just the point.
    if (previous) return (next ? previous.next = next : delete previous.next), this;

    // If this is the root point, remove it.
    if (!parent) return this._root = next, this;

    // Remove this leaf.
    next ? parent[i] = next : delete parent[i];

    // If the parent now contains exactly one leaf, collapse superfluous parents.
    if ((node = parent[0] || parent[1] || parent[2] || parent[3])
        && node === (parent[3] || parent[2] || parent[1] || parent[0])
        && !node.length) {
      if (retainer) retainer[j] = node;
      else this._root = node;
    }

    return this;
  }

  function removeAll$2(data) {
    for (var i = 0, n = data.length; i < n; ++i) this.remove(data[i]);
    return this;
  }

  function tree_root$2() {
    return this._root;
  }

  function tree_size$2() {
    var size = 0;
    this.visit(function(node) {
      if (!node.length) do ++size; while (node = node.next)
    });
    return size;
  }

  function tree_visit$2(callback) {
    var quads = [], q, node = this._root, child, x0, y0, x1, y1;
    if (node) quads.push(new Quad$1(node, this._x0, this._y0, this._x1, this._y1));
    while (q = quads.pop()) {
      if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
        var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
        if (child = node[3]) quads.push(new Quad$1(child, xm, ym, x1, y1));
        if (child = node[2]) quads.push(new Quad$1(child, x0, ym, xm, y1));
        if (child = node[1]) quads.push(new Quad$1(child, xm, y0, x1, ym));
        if (child = node[0]) quads.push(new Quad$1(child, x0, y0, xm, ym));
      }
    }
    return this;
  }

  function tree_visitAfter$2(callback) {
    var quads = [], next = [], q;
    if (this._root) quads.push(new Quad$1(this._root, this._x0, this._y0, this._x1, this._y1));
    while (q = quads.pop()) {
      var node = q.node;
      if (node.length) {
        var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
        if (child = node[0]) quads.push(new Quad$1(child, x0, y0, xm, ym));
        if (child = node[1]) quads.push(new Quad$1(child, xm, y0, x1, ym));
        if (child = node[2]) quads.push(new Quad$1(child, x0, ym, xm, y1));
        if (child = node[3]) quads.push(new Quad$1(child, xm, ym, x1, y1));
      }
      next.push(q);
    }
    while (q = next.pop()) {
      callback(q.node, q.x0, q.y0, q.x1, q.y1);
    }
    return this;
  }

  function defaultX$2(d) {
    return d[0];
  }

  function tree_x$2(_) {
    return arguments.length ? (this._x = _, this) : this._x;
  }

  function defaultY$1(d) {
    return d[1];
  }

  function tree_y$1(_) {
    return arguments.length ? (this._y = _, this) : this._y;
  }

  function quadtree(nodes, x, y) {
    var tree = new Quadtree(x == null ? defaultX$2 : x, y == null ? defaultY$1 : y, NaN, NaN, NaN, NaN);
    return nodes == null ? tree : tree.addAll(nodes);
  }

  function Quadtree(x, y, x0, y0, x1, y1) {
    this._x = x;
    this._y = y;
    this._x0 = x0;
    this._y0 = y0;
    this._x1 = x1;
    this._y1 = y1;
    this._root = undefined;
  }

  function leaf_copy$2(leaf) {
    var copy = {data: leaf.data}, next = copy;
    while (leaf = leaf.next) next = next.next = {data: leaf.data};
    return copy;
  }

  var treeProto$2 = quadtree.prototype = Quadtree.prototype;

  treeProto$2.copy = function() {
    var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1),
        node = this._root,
        nodes,
        child;

    if (!node) return copy;

    if (!node.length) return copy._root = leaf_copy$2(node), copy;

    nodes = [{source: node, target: copy._root = new Array(4)}];
    while (node = nodes.pop()) {
      for (var i = 0; i < 4; ++i) {
        if (child = node.source[i]) {
          if (child.length) nodes.push({source: child, target: node.target[i] = new Array(4)});
          else node.target[i] = leaf_copy$2(child);
        }
      }
    }

    return copy;
  };

  treeProto$2.add = tree_add$2;
  treeProto$2.addAll = addAll$2;
  treeProto$2.cover = tree_cover$2;
  treeProto$2.data = tree_data$2;
  treeProto$2.extent = tree_extent$2;
  treeProto$2.find = tree_find$2;
  treeProto$2.remove = tree_remove$2;
  treeProto$2.removeAll = removeAll$2;
  treeProto$2.root = tree_root$2;
  treeProto$2.size = tree_size$2;
  treeProto$2.visit = tree_visit$2;
  treeProto$2.visitAfter = tree_visitAfter$2;
  treeProto$2.x = tree_x$2;
  treeProto$2.y = tree_y$1;

  function tree_add$1(d) {
    const x = +this._x.call(null, d),
        y = +this._y.call(null, d),
        z = +this._z.call(null, d);
    return add$1(this.cover(x, y, z), x, y, z, d);
  }

  function add$1(tree, x, y, z, d) {
    if (isNaN(x) || isNaN(y) || isNaN(z)) return tree; // ignore invalid points

    var parent,
        node = tree._root,
        leaf = {data: d},
        x0 = tree._x0,
        y0 = tree._y0,
        z0 = tree._z0,
        x1 = tree._x1,
        y1 = tree._y1,
        z1 = tree._z1,
        xm,
        ym,
        zm,
        xp,
        yp,
        zp,
        right,
        bottom,
        deep,
        i,
        j;

    // If the tree is empty, initialize the root as a leaf.
    if (!node) return tree._root = leaf, tree;

    // Find the existing leaf for the new point, or add it.
    while (node.length) {
      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
      if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
      if (deep = z >= (zm = (z0 + z1) / 2)) z0 = zm; else z1 = zm;
      if (parent = node, !(node = node[i = deep << 2 | bottom << 1 | right])) return parent[i] = leaf, tree;
    }

    // Is the new point is exactly coincident with the existing point?
    xp = +tree._x.call(null, node.data);
    yp = +tree._y.call(null, node.data);
    zp = +tree._z.call(null, node.data);
    if (x === xp && y === yp && z === zp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;

    // Otherwise, split the leaf node until the old and new point are separated.
    do {
      parent = parent ? parent[i] = new Array(8) : tree._root = new Array(8);
      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
      if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
      if (deep = z >= (zm = (z0 + z1) / 2)) z0 = zm; else z1 = zm;
    } while ((i = deep << 2 | bottom << 1 | right) === (j = (zp >= zm) << 2 | (yp >= ym) << 1 | (xp >= xm)));
    return parent[j] = node, parent[i] = leaf, tree;
  }

  function addAll$1(data) {
    if (!Array.isArray(data)) data = Array.from(data);
    const n = data.length;
    const xz = new Float64Array(n);
    const yz = new Float64Array(n);
    const zz = new Float64Array(n);
    let x0 = Infinity,
        y0 = Infinity,
        z0 = Infinity,
        x1 = -Infinity,
        y1 = -Infinity,
        z1 = -Infinity;

    // Compute the points and their extent.
    for (let i = 0, d, x, y, z; i < n; ++i) {
      if (isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d)) || isNaN(z = +this._z.call(null, d))) continue;
      xz[i] = x;
      yz[i] = y;
      zz[i] = z;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
      if (z < z0) z0 = z;
      if (z > z1) z1 = z;
    }

    // If there were no (valid) points, abort.
    if (x0 > x1 || y0 > y1 || z0 > z1) return this;

    // Expand the tree to cover the new points.
    this.cover(x0, y0, z0).cover(x1, y1, z1);

    // Add the new points.
    for (let i = 0; i < n; ++i) {
      add$1(this, xz[i], yz[i], zz[i], data[i]);
    }

    return this;
  }

  function tree_cover$1(x, y, z) {
    if (isNaN(x = +x) || isNaN(y = +y) || isNaN(z = +z)) return this; // ignore invalid points

    var x0 = this._x0,
        y0 = this._y0,
        z0 = this._z0,
        x1 = this._x1,
        y1 = this._y1,
        z1 = this._z1;

    // If the octree has no extent, initialize them.
    // Integer extent are necessary so that if we later double the extent,
    // the existing octant boundaries don’t change due to floating point error!
    if (isNaN(x0)) {
      x1 = (x0 = Math.floor(x)) + 1;
      y1 = (y0 = Math.floor(y)) + 1;
      z1 = (z0 = Math.floor(z)) + 1;
    }

    // Otherwise, double repeatedly to cover.
    else {
      var t = x1 - x0 || 1,
          node = this._root,
          parent,
          i;

      while (x0 > x || x >= x1 || y0 > y || y >= y1 || z0 > z || z >= z1) {
        i = (z < z0) << 2 | (y < y0) << 1 | (x < x0);
        parent = new Array(8), parent[i] = node, node = parent, t *= 2;
        switch (i) {
          case 0: x1 = x0 + t, y1 = y0 + t, z1 = z0 + t; break;
          case 1: x0 = x1 - t, y1 = y0 + t, z1 = z0 + t; break;
          case 2: x1 = x0 + t, y0 = y1 - t, z1 = z0 + t; break;
          case 3: x0 = x1 - t, y0 = y1 - t, z1 = z0 + t; break;
          case 4: x1 = x0 + t, y1 = y0 + t, z0 = z1 - t; break;
          case 5: x0 = x1 - t, y1 = y0 + t, z0 = z1 - t; break;
          case 6: x1 = x0 + t, y0 = y1 - t, z0 = z1 - t; break;
          case 7: x0 = x1 - t, y0 = y1 - t, z0 = z1 - t; break;
        }
      }

      if (this._root && this._root.length) this._root = node;
    }

    this._x0 = x0;
    this._y0 = y0;
    this._z0 = z0;
    this._x1 = x1;
    this._y1 = y1;
    this._z1 = z1;
    return this;
  }

  function tree_data$1() {
    var data = [];
    this.visit(function(node) {
      if (!node.length) do data.push(node.data); while (node = node.next)
    });
    return data;
  }

  function tree_extent$1(_) {
    return arguments.length
        ? this.cover(+_[0][0], +_[0][1], +_[0][2]).cover(+_[1][0], +_[1][1], +_[1][2])
        : isNaN(this._x0) ? undefined : [[this._x0, this._y0, this._z0], [this._x1, this._y1, this._z1]];
  }

  function Octant(node, x0, y0, z0, x1, y1, z1) {
    this.node = node;
    this.x0 = x0;
    this.y0 = y0;
    this.z0 = z0;
    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;
  }

  function tree_find$1(x, y, z, radius) {
    var data,
        x0 = this._x0,
        y0 = this._y0,
        z0 = this._z0,
        x1,
        y1,
        z1,
        x2,
        y2,
        z2,
        x3 = this._x1,
        y3 = this._y1,
        z3 = this._z1,
        octs = [],
        node = this._root,
        q,
        i;

    if (node) octs.push(new Octant(node, x0, y0, z0, x3, y3, z3));
    if (radius == null) radius = Infinity;
    else {
      x0 = x - radius, y0 = y - radius, z0 = z - radius;
      x3 = x + radius, y3 = y + radius, z3 = z + radius;
      radius *= radius;
    }

    while (q = octs.pop()) {

      // Stop searching if this octant can’t contain a closer node.
      if (!(node = q.node)
          || (x1 = q.x0) > x3
          || (y1 = q.y0) > y3
          || (z1 = q.z0) > z3
          || (x2 = q.x1) < x0
          || (y2 = q.y1) < y0
          || (z2 = q.z1) < z0) continue;

      // Bisect the current octant.
      if (node.length) {
        var xm = (x1 + x2) / 2,
            ym = (y1 + y2) / 2,
            zm = (z1 + z2) / 2;

        octs.push(
          new Octant(node[7], xm, ym, zm, x2, y2, z2),
          new Octant(node[6], x1, ym, zm, xm, y2, z2),
          new Octant(node[5], xm, y1, zm, x2, ym, z2),
          new Octant(node[4], x1, y1, zm, xm, ym, z2),
          new Octant(node[3], xm, ym, z1, x2, y2, zm),
          new Octant(node[2], x1, ym, z1, xm, y2, zm),
          new Octant(node[1], xm, y1, z1, x2, ym, zm),
          new Octant(node[0], x1, y1, z1, xm, ym, zm)
        );

        // Visit the closest octant first.
        if (i = (z >= zm) << 2 | (y >= ym) << 1 | (x >= xm)) {
          q = octs[octs.length - 1];
          octs[octs.length - 1] = octs[octs.length - 1 - i];
          octs[octs.length - 1 - i] = q;
        }
      }

      // Visit this point. (Visiting coincident points isn’t necessary!)
      else {
        var dx = x - +this._x.call(null, node.data),
            dy = y - +this._y.call(null, node.data),
            dz = z - +this._z.call(null, node.data),
            d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < radius) {
          var d = Math.sqrt(radius = d2);
          x0 = x - d, y0 = y - d, z0 = z - d;
          x3 = x + d, y3 = y + d, z3 = z + d;
          data = node.data;
        }
      }
    }

    return data;
  }

  const distance = (x1, y1, z1, x2, y2, z2) => Math.sqrt((x1-x2)**2 + (y1-y2)**2 + (z1-z2)**2);

  function findAllWithinRadius(x, y, z, radius) {
    const result = [];

    const xMin = x - radius;
    const yMin = y - radius;
    const zMin = z - radius;
    const xMax = x + radius;
    const yMax = y + radius;
    const zMax = z + radius;

    this.visit((node, x1, y1, z1, x2, y2, z2) => {
      if (!node.length) {
        do {
          const d = node.data;
          if (distance(x, y, z, this._x(d), this._y(d), this._z(d)) <= radius) {
            result.push(d);
          }
        } while (node = node.next);
      }
      return x1 > xMax || y1 > yMax || z1 > zMax || x2 < xMin || y2 < yMin || z2 < zMin;
    });

    return result;
  }

  function tree_remove$1(d) {
    if (isNaN(x = +this._x.call(null, d)) || isNaN(y = +this._y.call(null, d)) || isNaN(z = +this._z.call(null, d))) return this; // ignore invalid points

    var parent,
        node = this._root,
        retainer,
        previous,
        next,
        x0 = this._x0,
        y0 = this._y0,
        z0 = this._z0,
        x1 = this._x1,
        y1 = this._y1,
        z1 = this._z1,
        x,
        y,
        z,
        xm,
        ym,
        zm,
        right,
        bottom,
        deep,
        i,
        j;

    // If the tree is empty, initialize the root as a leaf.
    if (!node) return this;

    // Find the leaf node for the point.
    // While descending, also retain the deepest parent with a non-removed sibling.
    if (node.length) while (true) {
      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
      if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
      if (deep = z >= (zm = (z0 + z1) / 2)) z0 = zm; else z1 = zm;
      if (!(parent = node, node = node[i = deep << 2 | bottom << 1 | right])) return this;
      if (!node.length) break;
      if (parent[(i + 1) & 7] || parent[(i + 2) & 7] || parent[(i + 3) & 7] || parent[(i + 4) & 7] || parent[(i + 5) & 7] || parent[(i + 6) & 7] || parent[(i + 7) & 7]) retainer = parent, j = i;
    }

    // Find the point to remove.
    while (node.data !== d) if (!(previous = node, node = node.next)) return this;
    if (next = node.next) delete node.next;

    // If there are multiple coincident points, remove just the point.
    if (previous) return (next ? previous.next = next : delete previous.next), this;

    // If this is the root point, remove it.
    if (!parent) return this._root = next, this;

    // Remove this leaf.
    next ? parent[i] = next : delete parent[i];

    // If the parent now contains exactly one leaf, collapse superfluous parents.
    if ((node = parent[0] || parent[1] || parent[2] || parent[3] || parent[4] || parent[5] || parent[6] || parent[7])
        && node === (parent[7] || parent[6] || parent[5] || parent[4] || parent[3] || parent[2] || parent[1] || parent[0])
        && !node.length) {
      if (retainer) retainer[j] = node;
      else this._root = node;
    }

    return this;
  }

  function removeAll$1(data) {
    for (var i = 0, n = data.length; i < n; ++i) this.remove(data[i]);
    return this;
  }

  function tree_root$1() {
    return this._root;
  }

  function tree_size$1() {
    var size = 0;
    this.visit(function(node) {
      if (!node.length) do ++size; while (node = node.next)
    });
    return size;
  }

  function tree_visit$1(callback) {
    var octs = [], q, node = this._root, child, x0, y0, z0, x1, y1, z1;
    if (node) octs.push(new Octant(node, this._x0, this._y0, this._z0, this._x1, this._y1, this._z1));
    while (q = octs.pop()) {
      if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, z0 = q.z0, x1 = q.x1, y1 = q.y1, z1 = q.z1) && node.length) {
        var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2, zm = (z0 + z1) / 2;
        if (child = node[7]) octs.push(new Octant(child, xm, ym, zm, x1, y1, z1));
        if (child = node[6]) octs.push(new Octant(child, x0, ym, zm, xm, y1, z1));
        if (child = node[5]) octs.push(new Octant(child, xm, y0, zm, x1, ym, z1));
        if (child = node[4]) octs.push(new Octant(child, x0, y0, zm, xm, ym, z1));
        if (child = node[3]) octs.push(new Octant(child, xm, ym, z0, x1, y1, zm));
        if (child = node[2]) octs.push(new Octant(child, x0, ym, z0, xm, y1, zm));
        if (child = node[1]) octs.push(new Octant(child, xm, y0, z0, x1, ym, zm));
        if (child = node[0]) octs.push(new Octant(child, x0, y0, z0, xm, ym, zm));
      }
    }
    return this;
  }

  function tree_visitAfter$1(callback) {
    var octs = [], next = [], q;
    if (this._root) octs.push(new Octant(this._root, this._x0, this._y0, this._z0, this._x1, this._y1, this._z1));
    while (q = octs.pop()) {
      var node = q.node;
      if (node.length) {
        var child, x0 = q.x0, y0 = q.y0, z0 = q.z0, x1 = q.x1, y1 = q.y1, z1 = q.z1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2, zm = (z0 + z1) / 2;
        if (child = node[0]) octs.push(new Octant(child, x0, y0, z0, xm, ym, zm));
        if (child = node[1]) octs.push(new Octant(child, xm, y0, z0, x1, ym, zm));
        if (child = node[2]) octs.push(new Octant(child, x0, ym, z0, xm, y1, zm));
        if (child = node[3]) octs.push(new Octant(child, xm, ym, z0, x1, y1, zm));
        if (child = node[4]) octs.push(new Octant(child, x0, y0, zm, xm, ym, z1));
        if (child = node[5]) octs.push(new Octant(child, xm, y0, zm, x1, ym, z1));
        if (child = node[6]) octs.push(new Octant(child, x0, ym, zm, xm, y1, z1));
        if (child = node[7]) octs.push(new Octant(child, xm, ym, zm, x1, y1, z1));
      }
      next.push(q);
    }
    while (q = next.pop()) {
      callback(q.node, q.x0, q.y0, q.z0, q.x1, q.y1, q.z1);
    }
    return this;
  }

  function defaultX$1(d) {
    return d[0];
  }

  function tree_x$1(_) {
    return arguments.length ? (this._x = _, this) : this._x;
  }

  function defaultY(d) {
    return d[1];
  }

  function tree_y(_) {
    return arguments.length ? (this._y = _, this) : this._y;
  }

  function defaultZ(d) {
    return d[2];
  }

  function tree_z(_) {
    return arguments.length ? (this._z = _, this) : this._z;
  }

  function octree(nodes, x, y, z) {
    var tree = new Octree(x == null ? defaultX$1 : x, y == null ? defaultY : y, z == null ? defaultZ : z, NaN, NaN, NaN, NaN, NaN, NaN);
    return nodes == null ? tree : tree.addAll(nodes);
  }

  function Octree(x, y, z, x0, y0, z0, x1, y1, z1) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._x0 = x0;
    this._y0 = y0;
    this._z0 = z0;
    this._x1 = x1;
    this._y1 = y1;
    this._z1 = z1;
    this._root = undefined;
  }

  function leaf_copy$1(leaf) {
    var copy = {data: leaf.data}, next = copy;
    while (leaf = leaf.next) next = next.next = {data: leaf.data};
    return copy;
  }

  var treeProto$1 = octree.prototype = Octree.prototype;

  treeProto$1.copy = function() {
    var copy = new Octree(this._x, this._y, this._z, this._x0, this._y0, this._z0, this._x1, this._y1, this._z1),
        node = this._root,
        nodes,
        child;

    if (!node) return copy;

    if (!node.length) return copy._root = leaf_copy$1(node), copy;

    nodes = [{source: node, target: copy._root = new Array(8)}];
    while (node = nodes.pop()) {
      for (var i = 0; i < 8; ++i) {
        if (child = node.source[i]) {
          if (child.length) nodes.push({source: child, target: node.target[i] = new Array(8)});
          else node.target[i] = leaf_copy$1(child);
        }
      }
    }

    return copy;
  };

  treeProto$1.add = tree_add$1;
  treeProto$1.addAll = addAll$1;
  treeProto$1.cover = tree_cover$1;
  treeProto$1.data = tree_data$1;
  treeProto$1.extent = tree_extent$1;
  treeProto$1.find = tree_find$1;
  treeProto$1.findAllWithinRadius = findAllWithinRadius;
  treeProto$1.remove = tree_remove$1;
  treeProto$1.removeAll = removeAll$1;
  treeProto$1.root = tree_root$1;
  treeProto$1.size = tree_size$1;
  treeProto$1.visit = tree_visit$1;
  treeProto$1.visitAfter = tree_visitAfter$1;
  treeProto$1.x = tree_x$1;
  treeProto$1.y = tree_y;
  treeProto$1.z = tree_z;

  const theta2 = 0.81; // Barnes-Hut approximation threshold
  const epsilon = 0.1; // 为了防止出现除0的情况，加一个epsilon
  function forceNBody(calcGraph, factor, coulombDisScale2, accMap, dimensions = 2) {
      const weightParam = factor / coulombDisScale2;
      const calcNodes = calcGraph.getAllNodes();
      const data = calcNodes.map((calcNode, i) => {
          const { nodeStrength, x, y, z, size } = calcNode.data;
          return {
              x,
              y,
              z,
              size,
              index: i,
              id: calcNode.id,
              vx: 0,
              vy: 0,
              vz: 0,
              weight: weightParam * nodeStrength,
          };
      });
      const tree = (dimensions === 2
          ? quadtree(data, (d) => d.x, (d) => d.y)
          : octree(data, (d) => d.x, (d) => d.y, (d) => d.z)).visitAfter(accumulate); // init internal node
      const nodeMap = new Map();
      data.forEach((n) => {
          nodeMap.set(n.id, n);
          // @ts-ignore
          computeForce(n, tree, dimensions);
      });
      data.map((n, i) => {
          const { id, data } = calcNodes[i];
          const { mass = 1 } = data;
          // 从 0 开始，= 初始化 + 加斥力
          accMap[id] = {
              x: n.vx / mass,
              y: n.vy / mass,
              z: n.vz / mass,
          };
      });
      return accMap;
  }
  function accumulate(treeNode) {
      let accWeight = 0;
      let accX = 0;
      let accY = 0;
      let accZ = 0;
      let accSize = 0;
      const numChildren = treeNode.length;
      if (numChildren) {
          // internal node, accumulate 4 child quads
          for (let i = 0; i < numChildren; i++) {
              const q = treeNode[i];
              if (q && q.weight) {
                  accWeight += q.weight;
                  accX += q.x * q.weight;
                  accY += q.y * q.weight;
                  accZ += q.z * q.weight;
                  accSize += q.size * q.weight;
              }
          }
          treeNode.x = accX / accWeight;
          treeNode.y = accY / accWeight;
          treeNode.z = accZ / accWeight;
          treeNode.size = accSize / accWeight;
          treeNode.weight = accWeight;
      }
      else {
          // leaf node
          const q = treeNode;
          treeNode.x = q.data.x;
          treeNode.y = q.data.y;
          treeNode.z = q.data.z;
          treeNode.size = q.data.size;
          treeNode.weight = q.data.weight;
      }
  }
  const apply$1 = (treeNode, x1, arg1, arg2, arg3, node, dimensions) => {
      var _a;
      if (((_a = treeNode.data) === null || _a === void 0 ? void 0 : _a.id) === node.id)
          return;
      const x2 = [arg1, arg2, arg3][dimensions - 1];
      const dx = node.x - treeNode.x || epsilon;
      const dy = node.y - treeNode.y || epsilon;
      const dz = node.z - treeNode.z || epsilon;
      const pos = [dx, dy, dz];
      const width = x2 - x1;
      let len2 = 0;
      for (let i = 0; i < dimensions; i++) {
          len2 += pos[i] * pos[i];
      }
      const len1 = Math.sqrt(len2);
      const len3 = len1 * len2;
      // far node, apply Barnes-Hut approximation
      if (width * width * theta2 < len2) {
          const param = treeNode.weight / len3;
          node.vx += dx * param;
          node.vy += dy * param;
          node.vz += dz * param;
          return true;
      }
      // near quad, compute force directly
      if (treeNode.length)
          return false; // internal node, visit children
      // leaf node
      if (treeNode.data !== node) {
          const param = treeNode.data.weight / len3;
          node.vx += dx * param;
          node.vy += dy * param;
          node.vz += dz * param;
      }
  };
  // @ts-ignore
  function computeForce(node, tree, dimensions) {
      // @ts-ignore
      tree.visit((treeNode, x1, y1, x2, y2) => apply$1(treeNode, x1, y1, x2, y2, node, dimensions));
  }

  const DEFAULTS_LAYOUT_OPTIONS$8 = {
      dimensions: 2,
      maxIteration: 500,
      gravity: 10,
      factor: 1,
      edgeStrength: 50,
      nodeStrength: 1000,
      coulombDisScale: 0.005,
      damping: 0.9,
      maxSpeed: 200,
      minMovement: 0.4,
      interval: 0.02,
      linkDistance: 200,
      clusterNodeStrength: 20,
      preventOverlap: true,
      distanceThresholdMode: 'mean',
  };
  /**
   * <zh/> 力导向布局
   *
   * <en/> Force-directed layout
   */
  class ForceLayout {
      constructor(options = {}) {
          this.options = options;
          this.id = 'force';
          /**
           * time interval for layout force animations
           */
          this.timeInterval = 0;
          /**
           * compare with minMovement to end the nodes' movement
           */
          this.judgingDistance = 0;
          this.running = false;
          this.options = Object.assign(Object.assign({}, DEFAULTS_LAYOUT_OPTIONS$8), options);
      }
      /**
       * Return the positions of nodes and edges(if needed).
       */
      execute(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              return this.genericForceLayout(false, graph, options);
          });
      }
      /**
       * To directly assign the positions to the nodes.
       */
      assign(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              yield this.genericForceLayout(true, graph, options);
          });
      }
      /**
       * Stop simulation immediately.
       */
      stop() {
          if (this.timeInterval && typeof window !== 'undefined') {
              window.clearInterval(this.timeInterval);
          }
          this.running = false;
      }
      /**
       * Manually steps the simulation by the specified number of iterations.
       * @see https://github.com/d3/d3-force#simulation_tick
       */
      tick(iterations = this.options.maxIteration || 1) {
          if (this.lastResult) {
              return this.lastResult;
          }
          for (let i = 0; (this.judgingDistance > this.lastOptions.minMovement || i < 1) &&
              i < iterations; i++) {
              this.runOneStep(this.lastCalcGraph, this.lastGraph, i, this.lastVelMap, this.lastOptions);
              this.updatePosition(this.lastGraph, this.lastCalcGraph, this.lastVelMap, this.lastOptions);
          }
          const result = {
              nodes: this.lastLayoutNodes,
              edges: this.lastLayoutEdges,
          };
          if (this.lastAssign) {
              result.nodes.forEach((node) => this.lastGraph.mergeNodeData(node.id, {
                  x: node.data.x,
                  y: node.data.y,
                  z: this.options.dimensions === 3 ? node.data.z : undefined,
              }));
          }
          return result;
      }
      genericForceLayout(assign, graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              const mergedOptions = Object.assign(Object.assign({}, this.options), options);
              const nodes = graph.getAllNodes();
              const edges = graph.getAllEdges();
              const formattedOptions = this.formatOptions(mergedOptions, graph);
              const { dimensions, width, height, nodeSize, getMass, nodeStrength, edgeStrength, linkDistance, } = formattedOptions;
              // clones the original data and attaches calculation attributes for this layout algorithm
              const layoutNodes = nodes.map((node, i) => {
                  return Object.assign(Object.assign({}, node), { data: Object.assign(Object.assign({}, node.data), { 
                          // ...randomDistribution(node, dimensions, 30, i),
                          x: isNumber(node.data.x) ? node.data.x : Math.random() * width, y: isNumber(node.data.y) ? node.data.y : Math.random() * height, z: isNumber(node.data.z)
                              ? node.data.z
                              : Math.random() * Math.sqrt(width * height), size: nodeSize(node) || 30, mass: getMass(node), nodeStrength: nodeStrength(node) }) });
              });
              const layoutEdges = edges.map((edge) => (Object.assign(Object.assign({}, edge), { data: Object.assign(Object.assign({}, edge.data), { edgeStrength: edgeStrength(edge), linkDistance: linkDistance(edge, graph.getNode(edge.source), graph.getNode(edge.target)) }) })));
              if (!(nodes === null || nodes === void 0 ? void 0 : nodes.length)) {
                  this.lastResult = { nodes: [], edges };
                  return { nodes: [], edges };
              }
              const velMap = {};
              nodes.forEach((node, i) => {
                  velMap[node.id] = {
                      x: 0,
                      y: 0,
                      z: 0,
                  };
              });
              const calcGraph = new Graph({
                  nodes: layoutNodes,
                  edges: layoutEdges,
              });
              this.formatCentripetal(formattedOptions, calcGraph);
              const { maxIteration, minMovement, onTick } = formattedOptions;
              // Use them later in `tick`.
              this.lastLayoutNodes = layoutNodes;
              this.lastLayoutEdges = layoutEdges;
              this.lastAssign = assign;
              this.lastGraph = graph;
              this.lastCalcGraph = calcGraph;
              this.lastOptions = formattedOptions;
              this.lastVelMap = velMap;
              if (typeof window === 'undefined')
                  return;
              let iter = 0;
              return new Promise((resolve) => {
                  // interval for render the result after each iteration
                  this.timeInterval = window.setInterval(() => {
                      if (!nodes || !this.running) {
                          resolve({
                              nodes: formatOutNodes(graph, layoutNodes),
                              edges,
                          });
                      }
                      this.runOneStep(calcGraph, graph, iter, velMap, formattedOptions);
                      this.updatePosition(graph, calcGraph, velMap, formattedOptions);
                      if (assign) {
                          layoutNodes.forEach((node) => graph.mergeNodeData(node.id, {
                              x: node.data.x,
                              y: node.data.y,
                              z: dimensions === 3 ? node.data.z : undefined,
                          }));
                      }
                      onTick === null || onTick === void 0 ? void 0 : onTick({
                          nodes: formatOutNodes(graph, layoutNodes),
                          edges,
                      });
                      iter++;
                      if (iter >= maxIteration || this.judgingDistance < minMovement) {
                          window.clearInterval(this.timeInterval);
                          resolve({
                              nodes: formatOutNodes(graph, layoutNodes),
                              edges,
                          });
                      }
                  }, 0);
                  this.running = true;
              });
          });
      }
      /**
       * Format merged layout options.
       * @param options merged layout options
       * @param graph original graph
       * @returns
       */
      formatOptions(options, graph) {
          const formattedOptions = Object.assign({}, options);
          const { width: propsWidth, height: propsHeight, getMass } = options;
          // === formating width, height, and center =====
          formattedOptions.width =
              !propsWidth && typeof window !== 'undefined'
                  ? window.innerWidth
                  : propsWidth;
          formattedOptions.height =
              !propsHeight && typeof window !== 'undefined'
                  ? window.innerHeight
                  : propsHeight;
          if (!options.center) {
              formattedOptions.center = [
                  formattedOptions.width / 2,
                  formattedOptions.height / 2,
              ];
          }
          // === formating node mass =====
          if (!getMass) {
              formattedOptions.getMass = (d) => {
                  let massWeight = 1;
                  if (isNumber(d === null || d === void 0 ? void 0 : d.data.mass))
                      massWeight = d === null || d === void 0 ? void 0 : d.data.mass;
                  const degree = graph.getDegree(d.id, 'both');
                  return !degree || degree < 5 ? massWeight : degree * 5 * massWeight;
              };
          }
          // === formating node size =====
          formattedOptions.nodeSize = formatNodeSizeToNumber(options.nodeSize, options.nodeSpacing);
          // === formating node / edge strengths =====
          const linkDistanceFn = options.linkDistance
              ? formatNumberFn(1, options.linkDistance)
              : (edge) => {
                  return (1 +
                      formattedOptions.nodeSize(graph.getNode(edge.source)) +
                      formattedOptions.nodeSize(graph.getNode(edge.target)));
              };
          formattedOptions.linkDistance = linkDistanceFn;
          formattedOptions.nodeStrength = formatNumberFn(1, options.nodeStrength);
          formattedOptions.edgeStrength = formatNumberFn(1, options.edgeStrength);
          return formattedOptions;
      }
      /**
       * Format centripetalOption in the option.
       * @param options merged layout options
       * @param calcGraph calculation graph
       */
      formatCentripetal(options, calcGraph) {
          const { dimensions, centripetalOptions, center, clusterNodeStrength, leafCluster, clustering, nodeClusterBy, } = options;
          const calcNodes = calcGraph.getAllNodes();
          // === formating centripetalOptions =====
          const basicCentripetal = centripetalOptions || {
              leaf: 2,
              single: 2,
              others: 1,
              // eslint-disable-next-line
              center: (n) => {
                  return {
                      x: center[0],
                      y: center[1],
                      z: dimensions === 3 ? center[2] : undefined,
                  };
              },
          };
          if (typeof clusterNodeStrength !== 'function') {
              options.clusterNodeStrength = (node) => clusterNodeStrength;
          }
          let sameTypeLeafMap;
          let clusters;
          if (leafCluster && nodeClusterBy) {
              sameTypeLeafMap = getSameTypeLeafMap(calcGraph, nodeClusterBy);
              clusters =
                  Array.from(new Set(calcNodes === null || calcNodes === void 0 ? void 0 : calcNodes.map((node) => node.data[nodeClusterBy]))) || [];
              // @ts-ignore
              options.centripetalOptions = Object.assign(basicCentripetal, {
                  single: 100,
                  leaf: (node) => {
                      // 找出与它关联的边的起点或终点出发的所有一度节点中同类型的叶子节点
                      const { siblingLeaves, sameTypeLeaves } = sameTypeLeafMap[node.id] || {};
                      // 如果都是同一类型或者每种类型只有1个，则施加默认向心力
                      if ((sameTypeLeaves === null || sameTypeLeaves === void 0 ? void 0 : sameTypeLeaves.length) === (siblingLeaves === null || siblingLeaves === void 0 ? void 0 : siblingLeaves.length) ||
                          (clusters === null || clusters === void 0 ? void 0 : clusters.length) === 1) {
                          return 1;
                      }
                      return options.clusterNodeStrength(node);
                  },
                  others: 1,
                  center: (node) => {
                      const degree = calcGraph.getDegree(node.id, 'both');
                      // 孤点默认给1个远离的中心点
                      if (!degree) {
                          return {
                              x: 100,
                              y: 100,
                              z: 0,
                          };
                      }
                      let centerPos;
                      if (degree === 1) {
                          // 如果为叶子节点
                          // 找出与它关联的边的起点出发的所有一度节点中同类型的叶子节点
                          const { sameTypeLeaves = [] } = sameTypeLeafMap[node.id] || {};
                          if (sameTypeLeaves.length === 1) {
                              // 如果同类型的叶子节点只有1个，中心位置为undefined
                              centerPos = undefined;
                          }
                          else if (sameTypeLeaves.length > 1) {
                              // 找出同类型节点平均位置作为中心
                              centerPos = getAvgNodePosition(sameTypeLeaves);
                          }
                      }
                      else {
                          centerPos = undefined;
                      }
                      return {
                          x: centerPos === null || centerPos === void 0 ? void 0 : centerPos.x,
                          y: centerPos === null || centerPos === void 0 ? void 0 : centerPos.y,
                          z: centerPos === null || centerPos === void 0 ? void 0 : centerPos.z,
                      };
                  },
              });
          }
          if (clustering && nodeClusterBy) {
              if (!sameTypeLeafMap) {
                  sameTypeLeafMap = getSameTypeLeafMap(calcGraph, nodeClusterBy);
              }
              if (!clusters) {
                  clusters = Array.from(new Set(calcNodes.map((node) => node.data[nodeClusterBy])));
              }
              clusters = clusters.filter((item) => item !== undefined);
              const centerInfo = {};
              clusters.forEach((cluster) => {
                  const sameTypeNodes = calcNodes
                      .filter((node) => node.data[nodeClusterBy] === cluster)
                      .map((node) => calcGraph.getNode(node.id));
                  // 找出同类型节点平均位置节点的距离最近的节点作为中心节点
                  centerInfo[cluster] = getAvgNodePosition(sameTypeNodes);
              });
              options.centripetalOptions = Object.assign(basicCentripetal, {
                  single: (node) => options.clusterNodeStrength(node),
                  leaf: (node) => options.clusterNodeStrength(node),
                  others: (node) => options.clusterNodeStrength(node),
                  center: (node) => {
                      // 找出同类型节点平均位置节点的距离最近的节点作为中心节点
                      const centerPos = centerInfo[node.data[nodeClusterBy]];
                      return {
                          x: centerPos === null || centerPos === void 0 ? void 0 : centerPos.x,
                          y: centerPos === null || centerPos === void 0 ? void 0 : centerPos.y,
                          z: centerPos === null || centerPos === void 0 ? void 0 : centerPos.z,
                      };
                  },
              });
          }
          const { leaf, single, others } = options.centripetalOptions || {};
          if (leaf && typeof leaf !== 'function') {
              options.centripetalOptions.leaf = () => leaf;
          }
          if (single && typeof single !== 'function') {
              options.centripetalOptions.single = () => single;
          }
          if (others && typeof others !== 'function') {
              options.centripetalOptions.others = () => others;
          }
      }
      /**
       * One iteration.
       * @param calcGraph calculation graph
       * @param graph origin graph
       * @param iter current iteration index
       * @param velMap nodes' velocity map
       * @param options formatted layout options
       * @returns
       */
      runOneStep(calcGraph, graph, iter, velMap, options) {
          const accMap = {};
          const calcNodes = calcGraph.getAllNodes();
          const calcEdges = calcGraph.getAllEdges();
          if (!(calcNodes === null || calcNodes === void 0 ? void 0 : calcNodes.length))
              return;
          const { monitor } = options;
          this.calRepulsive(calcGraph, accMap, options);
          if (calcEdges)
              this.calAttractive(calcGraph, accMap, options);
          this.calGravity(calcGraph, graph, accMap, options);
          this.updateVelocity(calcGraph, accMap, velMap, options);
          /** 如果需要监控信息，则提供给用户 */
          if (monitor) {
              const energy = this.calTotalEnergy(accMap, calcNodes);
              monitor({
                  energy,
                  nodes: graph.getAllNodes(),
                  edges: graph.getAllEdges(),
                  iterations: iter,
              });
          }
      }
      /**
       * Calculate graph energy for monitoring convergence.
       * @param accMap acceleration map
       * @param nodes calculation nodes
       * @returns energy
       */
      calTotalEnergy(accMap, nodes) {
          if (!(nodes === null || nodes === void 0 ? void 0 : nodes.length))
              return 0;
          let energy = 0.0;
          nodes.forEach((node, i) => {
              const vx = accMap[node.id].x;
              const vy = accMap[node.id].y;
              const vz = this.options.dimensions === 3 ? accMap[node.id].z : 0;
              const speed2 = vx * vx + vy * vy + vz * vz;
              const { mass = 1 } = node.data;
              energy += mass * speed2 * 0.5; // p = 1/2*(mv^2)
          });
          return energy;
      }
      /**
       * Calculate the repulsive forces according to coulombs law.
       * @param calcGraph calculation graph
       * @param accMap acceleration map
       * @param options formatted layout options
       */
      calRepulsive(calcGraph, accMap, options) {
          const { dimensions, factor, coulombDisScale } = options;
          forceNBody(calcGraph, factor, coulombDisScale * coulombDisScale, accMap, dimensions);
      }
      /**
       * Calculate the attractive forces according to hooks law.
       * @param calcGraph calculation graph
       * @param accMap acceleration map
       */
      calAttractive(calcGraph, accMap, options) {
          const { dimensions, nodeSize } = options;
          calcGraph.getAllEdges().forEach((edge, i) => {
              const { source, target } = edge;
              const sourceNode = calcGraph.getNode(source);
              const targetNode = calcGraph.getNode(target);
              if (!sourceNode || !targetNode)
                  return;
              let vecX = targetNode.data.x - sourceNode.data.x;
              let vecY = targetNode.data.y - sourceNode.data.y;
              let vecZ = dimensions === 3 ? targetNode.data.z - sourceNode.data.z : 0;
              if (!vecX && !vecY) {
                  vecX = Math.random() * 0.01;
                  vecY = Math.random() * 0.01;
                  if (dimensions === 3 && !vecZ) {
                      vecZ = Math.random() * 0.01;
                  }
              }
              const vecLength = Math.sqrt(vecX * vecX + vecY * vecY + vecZ * vecZ);
              if (vecLength < nodeSize(sourceNode) + nodeSize(targetNode))
                  return;
              const direX = vecX / vecLength;
              const direY = vecY / vecLength;
              const direZ = vecZ / vecLength;
              const { linkDistance = 200, edgeStrength = 200 } = edge.data || {};
              const diff = linkDistance - vecLength;
              const param = diff * edgeStrength;
              const massSource = sourceNode.data.mass || 1;
              const massTarget = targetNode.data.mass || 1;
              // 质量占比越大，对另一端影响程度越大
              const sourceMassRatio = 1 / massSource;
              const targetMassRatio = 1 / massTarget;
              const disX = direX * param;
              const disY = direY * param;
              const disZ = direZ * param;
              accMap[source].x -= disX * sourceMassRatio;
              accMap[source].y -= disY * sourceMassRatio;
              accMap[source].z -= disZ * sourceMassRatio;
              accMap[target].x += disX * targetMassRatio;
              accMap[target].y += disY * targetMassRatio;
              accMap[target].z += disZ * targetMassRatio;
          });
      }
      /**
       * Calculate the gravity forces toward center.
       * @param calcGraph calculation graph
       * @param graph origin graph
       * @param accMap acceleration map
       * @param options formatted layout options
       */
      calGravity(calcGraph, graph, accMap, options) {
          const { getCenter } = options;
          const calcNodes = calcGraph.getAllNodes();
          const nodes = graph.getAllNodes();
          const edges = graph.getAllEdges();
          const { width, height, center, gravity: defaultGravity, centripetalOptions, } = options;
          if (!calcNodes)
              return;
          calcNodes.forEach((calcNode) => {
              const { id, data } = calcNode;
              const { mass, x, y, z } = data;
              const node = graph.getNode(id);
              let vecX = 0;
              let vecY = 0;
              let vecZ = 0;
              let gravity = defaultGravity;
              const inDegree = calcGraph.getDegree(id, 'in');
              const outDegree = calcGraph.getDegree(id, 'out');
              const degree = calcGraph.getDegree(id, 'both');
              const forceCenter = getCenter === null || getCenter === void 0 ? void 0 : getCenter(node, degree);
              if (forceCenter) {
                  const [centerX, centerY, strength] = forceCenter;
                  vecX = x - centerX;
                  vecY = y - centerY;
                  gravity = strength;
              }
              else {
                  vecX = x - center[0];
                  vecY = y - center[1];
                  vecZ = z - center[2];
              }
              if (gravity) {
                  accMap[id].x -= (gravity * vecX) / mass;
                  accMap[id].y -= (gravity * vecY) / mass;
                  accMap[id].z -= (gravity * vecZ) / mass;
              }
              if (centripetalOptions) {
                  const { leaf, single, others, center: centriCenter, } = centripetalOptions;
                  const { x: centriX, y: centriY, z: centriZ, centerStrength, } = (centriCenter === null || centriCenter === void 0 ? void 0 : centriCenter(node, nodes, edges, width, height)) || {
                      x: 0,
                      y: 0,
                      z: 0,
                      centerStrength: 0,
                  };
                  if (!isNumber(centriX) || !isNumber(centriY))
                      return;
                  const vx = (x - centriX) / mass;
                  const vy = (y - centriY) / mass;
                  const vz = (z - centriZ) / mass;
                  if (centerStrength) {
                      accMap[id].x -= centerStrength * vx;
                      accMap[id].y -= centerStrength * vy;
                      accMap[id].z -= centerStrength * vz;
                  }
                  // 孤点
                  if (degree === 0) {
                      const singleStrength = single(node);
                      if (!singleStrength)
                          return;
                      accMap[id].x -= singleStrength * vx;
                      accMap[id].y -= singleStrength * vy;
                      accMap[id].z -= singleStrength * vz;
                      return;
                  }
                  // 没有出度或没有入度，都认为是叶子节点
                  if (inDegree === 0 || outDegree === 0) {
                      const leafStrength = leaf(node, nodes, edges);
                      if (!leafStrength)
                          return;
                      accMap[id].x -= leafStrength * vx;
                      accMap[id].y -= leafStrength * vy;
                      accMap[id].z -= leafStrength * vz;
                      return;
                  }
                  /** others */
                  const othersStrength = others(node);
                  if (!othersStrength)
                      return;
                  accMap[id].x -= othersStrength * vx;
                  accMap[id].y -= othersStrength * vy;
                  accMap[id].z -= othersStrength * vz;
              }
          });
      }
      /**
       * Update the velocities for nodes.
       * @param calcGraph calculation graph
       * @param accMap acceleration map
       * @param velMap velocity map
       * @param options formatted layout options
       * @returns
       */
      updateVelocity(calcGraph, accMap, velMap, options) {
          const { damping, maxSpeed, interval, dimensions } = options;
          const calcNodes = calcGraph.getAllNodes();
          if (!(calcNodes === null || calcNodes === void 0 ? void 0 : calcNodes.length))
              return;
          calcNodes.forEach((calcNode) => {
              const { id } = calcNode;
              let vx = (velMap[id].x + accMap[id].x * interval) * damping || 0.01;
              let vy = (velMap[id].y + accMap[id].y * interval) * damping || 0.01;
              let vz = dimensions === 3
                  ? (velMap[id].z + accMap[id].z * interval) * damping || 0.01
                  : 0.0;
              const vLength = Math.sqrt(vx * vx + vy * vy + vz * vz);
              if (vLength > maxSpeed) {
                  const param2 = maxSpeed / vLength;
                  vx = param2 * vx;
                  vy = param2 * vy;
                  vz = param2 * vz;
              }
              velMap[id] = {
                  x: vx,
                  y: vy,
                  z: vz,
              };
          });
      }
      /**
       * Update nodes' positions.
       * @param graph origin graph
       * @param calcGraph calculatition graph
       * @param velMap velocity map
       * @param options formatted layou options
       * @returns
       */
      updatePosition(graph, calcGraph, velMap, options) {
          const { distanceThresholdMode, interval, dimensions } = options;
          const calcNodes = calcGraph.getAllNodes();
          if (!(calcNodes === null || calcNodes === void 0 ? void 0 : calcNodes.length)) {
              this.judgingDistance = 0;
              return;
          }
          let sum = 0;
          if (distanceThresholdMode === 'max')
              this.judgingDistance = -Infinity;
          else if (distanceThresholdMode === 'min')
              this.judgingDistance = Infinity;
          calcNodes.forEach((calcNode) => {
              const { id } = calcNode;
              const node = graph.getNode(id);
              if (isNumber(node.data.fx) && isNumber(node.data.fy)) {
                  calcGraph.mergeNodeData(id, {
                      x: node.data.fx,
                      y: node.data.fy,
                      z: dimensions === 3 ? node.data.fz : undefined,
                  });
                  return;
              }
              const distX = velMap[id].x * interval;
              const distY = velMap[id].y * interval;
              const distZ = dimensions === 3 ? velMap[id].z * interval : 0.0;
              calcGraph.mergeNodeData(id, {
                  x: calcNode.data.x + distX,
                  y: calcNode.data.y + distY,
                  z: calcNode.data.z + distZ,
              });
              const distanceMagnitude = Math.sqrt(distX * distX + distY * distY + distZ * distZ);
              switch (distanceThresholdMode) {
                  case 'max':
                      if (this.judgingDistance < distanceMagnitude) {
                          this.judgingDistance = distanceMagnitude;
                      }
                      break;
                  case 'min':
                      if (this.judgingDistance > distanceMagnitude) {
                          this.judgingDistance = distanceMagnitude;
                      }
                      break;
                  default:
                      sum = sum + distanceMagnitude;
                      break;
              }
          });
          if (!distanceThresholdMode || distanceThresholdMode === 'mean') {
              this.judgingDistance = sum / calcNodes.length;
          }
      }
  }
  /**
   * Group the leaf nodes according to nodeClusterBy field.
   * @param calcGraph calculation graph
   * @param nodeClusterBy the field name in node.data to ditinguish different node clusters
   * @returns related same group leaf nodes for each leaf node
   */
  const getSameTypeLeafMap = (calcGraph, nodeClusterBy) => {
      const calcNodes = calcGraph.getAllNodes();
      if (!(calcNodes === null || calcNodes === void 0 ? void 0 : calcNodes.length))
          return {};
      const sameTypeLeafMap = {};
      calcNodes.forEach((node, i) => {
          const degree = calcGraph.getDegree(node.id, 'both');
          if (degree === 1) {
              sameTypeLeafMap[node.id] = getCoreNodeAndSiblingLeaves(calcGraph, 'leaf', node, nodeClusterBy);
          }
      });
      return sameTypeLeafMap;
  };
  /**
   * Find the successor or predecessor of node as coreNode, the sibling leaf nodes
   * @param calcGraph calculation graph
   * @param type ('all') filter out the not-same-cluster nodes, ('leaf') or filter out the not-leaf nodes in the same time
   * @param node the target node
   * @param nodeClusterBy the field name in node.data to ditinguish different node clusters
   * @returns coreNode, sibling leaf nodes, and grouped sibling leaf nodes
   */
  const getCoreNodeAndSiblingLeaves = (calcGraph, type, node, nodeClusterBy) => {
      const inDegree = calcGraph.getDegree(node.id, 'in');
      const outDegree = calcGraph.getDegree(node.id, 'out');
      // node is not a leaf, coreNode is itself, siblingLeaves is empty
      let coreNode = node;
      let siblingLeaves = [];
      if (inDegree === 0) {
          // node is a leaf node without out edges, its related(successor) node is coreNode, siblingLeaves is the neighbors of its related node
          coreNode = calcGraph.getSuccessors(node.id)[0];
          siblingLeaves = calcGraph.getNeighbors(coreNode.id);
      }
      else if (outDegree === 0) {
          // node is a leaf node without in edges, its related(predecessor) node is coreNode, siblingLeaves is the neighbors of its related node
          coreNode = calcGraph.getPredecessors(node.id)[0];
          siblingLeaves = calcGraph.getNeighbors(coreNode.id);
      }
      // siblingLeaves are leaf nodes
      siblingLeaves = siblingLeaves.filter((node) => calcGraph.getDegree(node.id, 'in') === 0 ||
          calcGraph.getDegree(node.id, 'out') === 0);
      const sameTypeLeaves = getSameTypeNodes(calcGraph, type, nodeClusterBy, node, siblingLeaves);
      return { coreNode, siblingLeaves, sameTypeLeaves };
  };
  /**
   * Find the same type (according to nodeClusterBy field) of node in relativeNodes.
   * @param calcGraph calculation graph
   * @param type ('all') filter out the not-same-cluster nodes, ('leaf') or filter out the not-leaf nodes in the same time
   * @param nodeClusterBy the field name in node.data to ditinguish different node clusters
   * @param node the target node
   * @param relativeNodes node's related ndoes to be filtered
   * @returns related nodes that meet the filtering conditions
   */
  const getSameTypeNodes = (calcGraph, type, nodeClusterBy, node, relativeNodes) => {
      const typeName = node.data[nodeClusterBy] || '';
      let sameTypeNodes = (relativeNodes === null || relativeNodes === void 0 ? void 0 : relativeNodes.filter((item) => item.data[nodeClusterBy] === typeName)) ||
          [];
      {
          sameTypeNodes = sameTypeNodes.filter((item) => calcGraph.getDegree(item.id, 'in') === 0 ||
              calcGraph.getDegree(item.id, 'out') === 0);
      }
      return sameTypeNodes;
  };
  /**
   * Get the average position of nodes.
   * @param nodes nodes set
   * @returns average ppsition
   */
  const getAvgNodePosition = (nodes) => {
      const totalNodes = { x: 0, y: 0 };
      nodes.forEach((node) => {
          const { x, y } = node.data;
          totalNodes.x += x || 0;
          totalNodes.y += y || 0;
      });
      // 获取均值向量
      const length = nodes.length || 1;
      return {
          x: totalNodes.x / length,
          y: totalNodes.y / length,
      };
  };
  /**
   * Format the output nodes from CalcNode[].
   * @param graph origin graph
   * @param layoutNodes calculation nodes
   * @returns output nodes
   */
  const formatOutNodes = (graph, layoutNodes) => layoutNodes.map((calcNode) => {
      const { id, data } = calcNode;
      const node = graph.getNode(id);
      return Object.assign(Object.assign({}, node), { data: Object.assign(Object.assign({}, node.data), { x: data.x, y: data.y, z: data.z }) });
  });

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function getAugmentedNamespace(n) {
    if (Object.prototype.hasOwnProperty.call(n, '__esModule')) return n;
    var f = n.default;
  	if (typeof f == "function") {
  		var a = function a () {
  			if (this instanceof a) {
          return Reflect.construct(f, arguments, this.constructor);
  			}
  			return f.apply(this, arguments);
  		};
  		a.prototype = f.prototype;
    } else a = {};
    Object.defineProperty(a, '__esModule', {value: true});
  	Object.keys(n).forEach(function (k) {
  		var d = Object.getOwnPropertyDescriptor(n, k);
  		Object.defineProperty(a, k, d.get ? d : {
  			enumerable: true,
  			get: function () {
  				return n[k];
  			}
  		});
  	});
  	return a;
  }

  var matrix$1 = {};

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const toString = Object.prototype.toString;
  /**
   * Checks if an object is an instance of an Array (array or typed array, except those that contain bigint values).
   *
   * @param value - Object to check.
   * @returns True if the object is an array or a typed array.
   */
  function isAnyArray(value) {
      const tag = toString.call(value);
      return tag.endsWith('Array]') && !tag.includes('Big');
  }

  var libEsm = /*#__PURE__*/Object.freeze({
    __proto__: null,
    isAnyArray: isAnyArray
  });

  var require$$0 = /*@__PURE__*/getAugmentedNamespace(libEsm);

  function max(input) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!isAnyArray(input)) {
      throw new TypeError('input must be an array');
    }

    if (input.length === 0) {
      throw new TypeError('input must not be empty');
    }

    var _options$fromIndex = options.fromIndex,
        fromIndex = _options$fromIndex === void 0 ? 0 : _options$fromIndex,
        _options$toIndex = options.toIndex,
        toIndex = _options$toIndex === void 0 ? input.length : _options$toIndex;

    if (fromIndex < 0 || fromIndex >= input.length || !Number.isInteger(fromIndex)) {
      throw new Error('fromIndex must be a positive integer smaller than length');
    }

    if (toIndex <= fromIndex || toIndex > input.length || !Number.isInteger(toIndex)) {
      throw new Error('toIndex must be an integer greater than fromIndex and at most equal to length');
    }

    var maxValue = input[fromIndex];

    for (var i = fromIndex + 1; i < toIndex; i++) {
      if (input[i] > maxValue) maxValue = input[i];
    }

    return maxValue;
  }

  function min(input) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!isAnyArray(input)) {
      throw new TypeError('input must be an array');
    }

    if (input.length === 0) {
      throw new TypeError('input must not be empty');
    }

    var _options$fromIndex = options.fromIndex,
        fromIndex = _options$fromIndex === void 0 ? 0 : _options$fromIndex,
        _options$toIndex = options.toIndex,
        toIndex = _options$toIndex === void 0 ? input.length : _options$toIndex;

    if (fromIndex < 0 || fromIndex >= input.length || !Number.isInteger(fromIndex)) {
      throw new Error('fromIndex must be a positive integer smaller than length');
    }

    if (toIndex <= fromIndex || toIndex > input.length || !Number.isInteger(toIndex)) {
      throw new Error('toIndex must be an integer greater than fromIndex and at most equal to length');
    }

    var minValue = input[fromIndex];

    for (var i = fromIndex + 1; i < toIndex; i++) {
      if (input[i] < minValue) minValue = input[i];
    }

    return minValue;
  }

  function rescale(input) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!isAnyArray(input)) {
      throw new TypeError('input must be an array');
    } else if (input.length === 0) {
      throw new TypeError('input must not be empty');
    }

    var output;

    if (options.output !== undefined) {
      if (!isAnyArray(options.output)) {
        throw new TypeError('output option must be an array if specified');
      }

      output = options.output;
    } else {
      output = new Array(input.length);
    }

    var currentMin = min(input);
    var currentMax = max(input);

    if (currentMin === currentMax) {
      throw new RangeError('minimum and maximum input values are equal. Cannot rescale a constant array');
    }

    var _options$min = options.min,
        minValue = _options$min === void 0 ? options.autoMinMax ? currentMin : 0 : _options$min,
        _options$max = options.max,
        maxValue = _options$max === void 0 ? options.autoMinMax ? currentMax : 1 : _options$max;

    if (minValue >= maxValue) {
      throw new RangeError('min option must be smaller than max option');
    }

    var factor = (maxValue - minValue) / (currentMax - currentMin);

    for (var i = 0; i < input.length; i++) {
      output[i] = (input[i] - currentMin) * factor + minValue;
    }

    return output;
  }

  var libEs6 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: rescale
  });

  var require$$1 = /*@__PURE__*/getAugmentedNamespace(libEs6);

  var hasRequiredMatrix;

  function requireMatrix () {
  	if (hasRequiredMatrix) return matrix$1;
  	hasRequiredMatrix = 1;

  	Object.defineProperty(matrix$1, '__esModule', { value: true });

  	var isAnyArray = require$$0;
  	var rescale = require$$1;

  	const indent = ' '.repeat(2);
  	const indentData = ' '.repeat(4);

  	/**
  	 * @this {Matrix}
  	 * @returns {string}
  	 */
  	function inspectMatrix() {
  	  return inspectMatrixWithOptions(this);
  	}

  	function inspectMatrixWithOptions(matrix, options = {}) {
  	  const {
  	    maxRows = 15,
  	    maxColumns = 10,
  	    maxNumSize = 8,
  	    padMinus = 'auto',
  	  } = options;
  	  return `${matrix.constructor.name} {
${indent}[
${indentData}${inspectData(matrix, maxRows, maxColumns, maxNumSize, padMinus)}
${indent}]
${indent}rows: ${matrix.rows}
${indent}columns: ${matrix.columns}
}`;
  	}

  	function inspectData(matrix, maxRows, maxColumns, maxNumSize, padMinus) {
  	  const { rows, columns } = matrix;
  	  const maxI = Math.min(rows, maxRows);
  	  const maxJ = Math.min(columns, maxColumns);
  	  const result = [];

  	  if (padMinus === 'auto') {
  	    padMinus = false;
  	    loop: for (let i = 0; i < maxI; i++) {
  	      for (let j = 0; j < maxJ; j++) {
  	        if (matrix.get(i, j) < 0) {
  	          padMinus = true;
  	          break loop;
  	        }
  	      }
  	    }
  	  }

  	  for (let i = 0; i < maxI; i++) {
  	    let line = [];
  	    for (let j = 0; j < maxJ; j++) {
  	      line.push(formatNumber(matrix.get(i, j), maxNumSize, padMinus));
  	    }
  	    result.push(`${line.join(' ')}`);
  	  }
  	  if (maxJ !== columns) {
  	    result[result.length - 1] += ` ... ${columns - maxColumns} more columns`;
  	  }
  	  if (maxI !== rows) {
  	    result.push(`... ${rows - maxRows} more rows`);
  	  }
  	  return result.join(`\n${indentData}`);
  	}

  	function formatNumber(num, maxNumSize, padMinus) {
  	  return (
  	    num >= 0 && padMinus
  	      ? ` ${formatNumber2(num, maxNumSize - 1)}`
  	      : formatNumber2(num, maxNumSize)
  	  ).padEnd(maxNumSize);
  	}

  	function formatNumber2(num, len) {
  	  // small.length numbers should be as is
  	  let str = num.toString();
  	  if (str.length <= len) return str;

  	  // (7)'0.00123' is better then (7)'1.23e-2'
  	  // (8)'0.000123' is worse then (7)'1.23e-3',
  	  let fix = num.toFixed(len);
  	  if (fix.length > len) {
  	    fix = num.toFixed(Math.max(0, len - (fix.length - len)));
  	  }
  	  if (
  	    fix.length <= len &&
  	    !fix.startsWith('0.000') &&
  	    !fix.startsWith('-0.000')
  	  ) {
  	    return fix;
  	  }

  	  // well, if it's still too long the user should've used longer numbers
  	  let exp = num.toExponential(len);
  	  if (exp.length > len) {
  	    exp = num.toExponential(Math.max(0, len - (exp.length - len)));
  	  }
  	  return exp.slice(0);
  	}

  	function installMathOperations(AbstractMatrix, Matrix) {
  	  AbstractMatrix.prototype.add = function add(value) {
  	    if (typeof value === 'number') return this.addS(value);
  	    return this.addM(value);
  	  };

  	  AbstractMatrix.prototype.addS = function addS(value) {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) + value);
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.prototype.addM = function addM(matrix) {
  	    matrix = Matrix.checkMatrix(matrix);
  	    if (this.rows !== matrix.rows ||
  	      this.columns !== matrix.columns) {
  	      throw new RangeError('Matrices dimensions must be equal');
  	    }
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) + matrix.get(i, j));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.add = function add(matrix, value) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.add(value);
  	  };

  	  AbstractMatrix.prototype.sub = function sub(value) {
  	    if (typeof value === 'number') return this.subS(value);
  	    return this.subM(value);
  	  };

  	  AbstractMatrix.prototype.subS = function subS(value) {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) - value);
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.prototype.subM = function subM(matrix) {
  	    matrix = Matrix.checkMatrix(matrix);
  	    if (this.rows !== matrix.rows ||
  	      this.columns !== matrix.columns) {
  	      throw new RangeError('Matrices dimensions must be equal');
  	    }
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) - matrix.get(i, j));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.sub = function sub(matrix, value) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.sub(value);
  	  };
  	  AbstractMatrix.prototype.subtract = AbstractMatrix.prototype.sub;
  	  AbstractMatrix.prototype.subtractS = AbstractMatrix.prototype.subS;
  	  AbstractMatrix.prototype.subtractM = AbstractMatrix.prototype.subM;
  	  AbstractMatrix.subtract = AbstractMatrix.sub;

  	  AbstractMatrix.prototype.mul = function mul(value) {
  	    if (typeof value === 'number') return this.mulS(value);
  	    return this.mulM(value);
  	  };

  	  AbstractMatrix.prototype.mulS = function mulS(value) {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) * value);
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.prototype.mulM = function mulM(matrix) {
  	    matrix = Matrix.checkMatrix(matrix);
  	    if (this.rows !== matrix.rows ||
  	      this.columns !== matrix.columns) {
  	      throw new RangeError('Matrices dimensions must be equal');
  	    }
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) * matrix.get(i, j));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.mul = function mul(matrix, value) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.mul(value);
  	  };
  	  AbstractMatrix.prototype.multiply = AbstractMatrix.prototype.mul;
  	  AbstractMatrix.prototype.multiplyS = AbstractMatrix.prototype.mulS;
  	  AbstractMatrix.prototype.multiplyM = AbstractMatrix.prototype.mulM;
  	  AbstractMatrix.multiply = AbstractMatrix.mul;

  	  AbstractMatrix.prototype.div = function div(value) {
  	    if (typeof value === 'number') return this.divS(value);
  	    return this.divM(value);
  	  };

  	  AbstractMatrix.prototype.divS = function divS(value) {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) / value);
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.prototype.divM = function divM(matrix) {
  	    matrix = Matrix.checkMatrix(matrix);
  	    if (this.rows !== matrix.rows ||
  	      this.columns !== matrix.columns) {
  	      throw new RangeError('Matrices dimensions must be equal');
  	    }
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) / matrix.get(i, j));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.div = function div(matrix, value) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.div(value);
  	  };
  	  AbstractMatrix.prototype.divide = AbstractMatrix.prototype.div;
  	  AbstractMatrix.prototype.divideS = AbstractMatrix.prototype.divS;
  	  AbstractMatrix.prototype.divideM = AbstractMatrix.prototype.divM;
  	  AbstractMatrix.divide = AbstractMatrix.div;

  	  AbstractMatrix.prototype.mod = function mod(value) {
  	    if (typeof value === 'number') return this.modS(value);
  	    return this.modM(value);
  	  };

  	  AbstractMatrix.prototype.modS = function modS(value) {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) % value);
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.prototype.modM = function modM(matrix) {
  	    matrix = Matrix.checkMatrix(matrix);
  	    if (this.rows !== matrix.rows ||
  	      this.columns !== matrix.columns) {
  	      throw new RangeError('Matrices dimensions must be equal');
  	    }
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) % matrix.get(i, j));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.mod = function mod(matrix, value) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.mod(value);
  	  };
  	  AbstractMatrix.prototype.modulus = AbstractMatrix.prototype.mod;
  	  AbstractMatrix.prototype.modulusS = AbstractMatrix.prototype.modS;
  	  AbstractMatrix.prototype.modulusM = AbstractMatrix.prototype.modM;
  	  AbstractMatrix.modulus = AbstractMatrix.mod;

  	  AbstractMatrix.prototype.and = function and(value) {
  	    if (typeof value === 'number') return this.andS(value);
  	    return this.andM(value);
  	  };

  	  AbstractMatrix.prototype.andS = function andS(value) {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) & value);
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.prototype.andM = function andM(matrix) {
  	    matrix = Matrix.checkMatrix(matrix);
  	    if (this.rows !== matrix.rows ||
  	      this.columns !== matrix.columns) {
  	      throw new RangeError('Matrices dimensions must be equal');
  	    }
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) & matrix.get(i, j));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.and = function and(matrix, value) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.and(value);
  	  };

  	  AbstractMatrix.prototype.or = function or(value) {
  	    if (typeof value === 'number') return this.orS(value);
  	    return this.orM(value);
  	  };

  	  AbstractMatrix.prototype.orS = function orS(value) {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) | value);
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.prototype.orM = function orM(matrix) {
  	    matrix = Matrix.checkMatrix(matrix);
  	    if (this.rows !== matrix.rows ||
  	      this.columns !== matrix.columns) {
  	      throw new RangeError('Matrices dimensions must be equal');
  	    }
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) | matrix.get(i, j));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.or = function or(matrix, value) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.or(value);
  	  };

  	  AbstractMatrix.prototype.xor = function xor(value) {
  	    if (typeof value === 'number') return this.xorS(value);
  	    return this.xorM(value);
  	  };

  	  AbstractMatrix.prototype.xorS = function xorS(value) {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) ^ value);
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.prototype.xorM = function xorM(matrix) {
  	    matrix = Matrix.checkMatrix(matrix);
  	    if (this.rows !== matrix.rows ||
  	      this.columns !== matrix.columns) {
  	      throw new RangeError('Matrices dimensions must be equal');
  	    }
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) ^ matrix.get(i, j));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.xor = function xor(matrix, value) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.xor(value);
  	  };

  	  AbstractMatrix.prototype.leftShift = function leftShift(value) {
  	    if (typeof value === 'number') return this.leftShiftS(value);
  	    return this.leftShiftM(value);
  	  };

  	  AbstractMatrix.prototype.leftShiftS = function leftShiftS(value) {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) << value);
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.prototype.leftShiftM = function leftShiftM(matrix) {
  	    matrix = Matrix.checkMatrix(matrix);
  	    if (this.rows !== matrix.rows ||
  	      this.columns !== matrix.columns) {
  	      throw new RangeError('Matrices dimensions must be equal');
  	    }
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) << matrix.get(i, j));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.leftShift = function leftShift(matrix, value) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.leftShift(value);
  	  };

  	  AbstractMatrix.prototype.signPropagatingRightShift = function signPropagatingRightShift(value) {
  	    if (typeof value === 'number') return this.signPropagatingRightShiftS(value);
  	    return this.signPropagatingRightShiftM(value);
  	  };

  	  AbstractMatrix.prototype.signPropagatingRightShiftS = function signPropagatingRightShiftS(value) {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) >> value);
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.prototype.signPropagatingRightShiftM = function signPropagatingRightShiftM(matrix) {
  	    matrix = Matrix.checkMatrix(matrix);
  	    if (this.rows !== matrix.rows ||
  	      this.columns !== matrix.columns) {
  	      throw new RangeError('Matrices dimensions must be equal');
  	    }
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) >> matrix.get(i, j));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.signPropagatingRightShift = function signPropagatingRightShift(matrix, value) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.signPropagatingRightShift(value);
  	  };

  	  AbstractMatrix.prototype.rightShift = function rightShift(value) {
  	    if (typeof value === 'number') return this.rightShiftS(value);
  	    return this.rightShiftM(value);
  	  };

  	  AbstractMatrix.prototype.rightShiftS = function rightShiftS(value) {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) >>> value);
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.prototype.rightShiftM = function rightShiftM(matrix) {
  	    matrix = Matrix.checkMatrix(matrix);
  	    if (this.rows !== matrix.rows ||
  	      this.columns !== matrix.columns) {
  	      throw new RangeError('Matrices dimensions must be equal');
  	    }
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) >>> matrix.get(i, j));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.rightShift = function rightShift(matrix, value) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.rightShift(value);
  	  };
  	  AbstractMatrix.prototype.zeroFillRightShift = AbstractMatrix.prototype.rightShift;
  	  AbstractMatrix.prototype.zeroFillRightShiftS = AbstractMatrix.prototype.rightShiftS;
  	  AbstractMatrix.prototype.zeroFillRightShiftM = AbstractMatrix.prototype.rightShiftM;
  	  AbstractMatrix.zeroFillRightShift = AbstractMatrix.rightShift;

  	  AbstractMatrix.prototype.not = function not() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, ~(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.not = function not(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.not();
  	  };

  	  AbstractMatrix.prototype.abs = function abs() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.abs(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.abs = function abs(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.abs();
  	  };

  	  AbstractMatrix.prototype.acos = function acos() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.acos(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.acos = function acos(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.acos();
  	  };

  	  AbstractMatrix.prototype.acosh = function acosh() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.acosh(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.acosh = function acosh(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.acosh();
  	  };

  	  AbstractMatrix.prototype.asin = function asin() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.asin(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.asin = function asin(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.asin();
  	  };

  	  AbstractMatrix.prototype.asinh = function asinh() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.asinh(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.asinh = function asinh(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.asinh();
  	  };

  	  AbstractMatrix.prototype.atan = function atan() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.atan(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.atan = function atan(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.atan();
  	  };

  	  AbstractMatrix.prototype.atanh = function atanh() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.atanh(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.atanh = function atanh(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.atanh();
  	  };

  	  AbstractMatrix.prototype.cbrt = function cbrt() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.cbrt(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.cbrt = function cbrt(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.cbrt();
  	  };

  	  AbstractMatrix.prototype.ceil = function ceil() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.ceil(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.ceil = function ceil(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.ceil();
  	  };

  	  AbstractMatrix.prototype.clz32 = function clz32() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.clz32(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.clz32 = function clz32(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.clz32();
  	  };

  	  AbstractMatrix.prototype.cos = function cos() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.cos(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.cos = function cos(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.cos();
  	  };

  	  AbstractMatrix.prototype.cosh = function cosh() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.cosh(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.cosh = function cosh(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.cosh();
  	  };

  	  AbstractMatrix.prototype.exp = function exp() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.exp(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.exp = function exp(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.exp();
  	  };

  	  AbstractMatrix.prototype.expm1 = function expm1() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.expm1(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.expm1 = function expm1(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.expm1();
  	  };

  	  AbstractMatrix.prototype.floor = function floor() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.floor(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.floor = function floor(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.floor();
  	  };

  	  AbstractMatrix.prototype.fround = function fround() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.fround(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.fround = function fround(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.fround();
  	  };

  	  AbstractMatrix.prototype.log = function log() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.log(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.log = function log(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.log();
  	  };

  	  AbstractMatrix.prototype.log1p = function log1p() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.log1p(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.log1p = function log1p(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.log1p();
  	  };

  	  AbstractMatrix.prototype.log10 = function log10() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.log10(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.log10 = function log10(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.log10();
  	  };

  	  AbstractMatrix.prototype.log2 = function log2() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.log2(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.log2 = function log2(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.log2();
  	  };

  	  AbstractMatrix.prototype.round = function round() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.round(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.round = function round(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.round();
  	  };

  	  AbstractMatrix.prototype.sign = function sign() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.sign(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.sign = function sign(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.sign();
  	  };

  	  AbstractMatrix.prototype.sin = function sin() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.sin(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.sin = function sin(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.sin();
  	  };

  	  AbstractMatrix.prototype.sinh = function sinh() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.sinh(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.sinh = function sinh(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.sinh();
  	  };

  	  AbstractMatrix.prototype.sqrt = function sqrt() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.sqrt(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.sqrt = function sqrt(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.sqrt();
  	  };

  	  AbstractMatrix.prototype.tan = function tan() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.tan(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.tan = function tan(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.tan();
  	  };

  	  AbstractMatrix.prototype.tanh = function tanh() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.tanh(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.tanh = function tanh(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.tanh();
  	  };

  	  AbstractMatrix.prototype.trunc = function trunc() {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, Math.trunc(this.get(i, j)));
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.trunc = function trunc(matrix) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.trunc();
  	  };

  	  AbstractMatrix.pow = function pow(matrix, arg0) {
  	    const newMatrix = new Matrix(matrix);
  	    return newMatrix.pow(arg0);
  	  };

  	  AbstractMatrix.prototype.pow = function pow(value) {
  	    if (typeof value === 'number') return this.powS(value);
  	    return this.powM(value);
  	  };

  	  AbstractMatrix.prototype.powS = function powS(value) {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) ** value);
  	      }
  	    }
  	    return this;
  	  };

  	  AbstractMatrix.prototype.powM = function powM(matrix) {
  	    matrix = Matrix.checkMatrix(matrix);
  	    if (this.rows !== matrix.rows ||
  	      this.columns !== matrix.columns) {
  	      throw new RangeError('Matrices dimensions must be equal');
  	    }
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) ** matrix.get(i, j));
  	      }
  	    }
  	    return this;
  	  };
  	}

  	/**
  	 * @private
  	 * Check that a row index is not out of bounds
  	 * @param {Matrix} matrix
  	 * @param {number} index
  	 * @param {boolean} [outer]
  	 */
  	function checkRowIndex(matrix, index, outer) {
  	  let max = outer ? matrix.rows : matrix.rows - 1;
  	  if (index < 0 || index > max) {
  	    throw new RangeError('Row index out of range');
  	  }
  	}

  	/**
  	 * @private
  	 * Check that a column index is not out of bounds
  	 * @param {Matrix} matrix
  	 * @param {number} index
  	 * @param {boolean} [outer]
  	 */
  	function checkColumnIndex(matrix, index, outer) {
  	  let max = outer ? matrix.columns : matrix.columns - 1;
  	  if (index < 0 || index > max) {
  	    throw new RangeError('Column index out of range');
  	  }
  	}

  	/**
  	 * @private
  	 * Check that the provided vector is an array with the right length
  	 * @param {Matrix} matrix
  	 * @param {Array|Matrix} vector
  	 * @return {Array}
  	 * @throws {RangeError}
  	 */
  	function checkRowVector(matrix, vector) {
  	  if (vector.to1DArray) {
  	    vector = vector.to1DArray();
  	  }
  	  if (vector.length !== matrix.columns) {
  	    throw new RangeError(
  	      'vector size must be the same as the number of columns',
  	    );
  	  }
  	  return vector;
  	}

  	/**
  	 * @private
  	 * Check that the provided vector is an array with the right length
  	 * @param {Matrix} matrix
  	 * @param {Array|Matrix} vector
  	 * @return {Array}
  	 * @throws {RangeError}
  	 */
  	function checkColumnVector(matrix, vector) {
  	  if (vector.to1DArray) {
  	    vector = vector.to1DArray();
  	  }
  	  if (vector.length !== matrix.rows) {
  	    throw new RangeError('vector size must be the same as the number of rows');
  	  }
  	  return vector;
  	}

  	function checkRowIndices(matrix, rowIndices) {
  	  if (!isAnyArray.isAnyArray(rowIndices)) {
  	    throw new TypeError('row indices must be an array');
  	  }

  	  for (let i = 0; i < rowIndices.length; i++) {
  	    if (rowIndices[i] < 0 || rowIndices[i] >= matrix.rows) {
  	      throw new RangeError('row indices are out of range');
  	    }
  	  }
  	}

  	function checkColumnIndices(matrix, columnIndices) {
  	  if (!isAnyArray.isAnyArray(columnIndices)) {
  	    throw new TypeError('column indices must be an array');
  	  }

  	  for (let i = 0; i < columnIndices.length; i++) {
  	    if (columnIndices[i] < 0 || columnIndices[i] >= matrix.columns) {
  	      throw new RangeError('column indices are out of range');
  	    }
  	  }
  	}

  	function checkRange(matrix, startRow, endRow, startColumn, endColumn) {
  	  if (arguments.length !== 5) {
  	    throw new RangeError('expected 4 arguments');
  	  }
  	  checkNumber('startRow', startRow);
  	  checkNumber('endRow', endRow);
  	  checkNumber('startColumn', startColumn);
  	  checkNumber('endColumn', endColumn);
  	  if (
  	    startRow > endRow ||
  	    startColumn > endColumn ||
  	    startRow < 0 ||
  	    startRow >= matrix.rows ||
  	    endRow < 0 ||
  	    endRow >= matrix.rows ||
  	    startColumn < 0 ||
  	    startColumn >= matrix.columns ||
  	    endColumn < 0 ||
  	    endColumn >= matrix.columns
  	  ) {
  	    throw new RangeError('Submatrix indices are out of range');
  	  }
  	}

  	function newArray(length, value = 0) {
  	  let array = [];
  	  for (let i = 0; i < length; i++) {
  	    array.push(value);
  	  }
  	  return array;
  	}

  	function checkNumber(name, value) {
  	  if (typeof value !== 'number') {
  	    throw new TypeError(`${name} must be a number`);
  	  }
  	}

  	function checkNonEmpty(matrix) {
  	  if (matrix.isEmpty()) {
  	    throw new Error('Empty matrix has no elements to index');
  	  }
  	}

  	function sumByRow(matrix) {
  	  let sum = newArray(matrix.rows);
  	  for (let i = 0; i < matrix.rows; ++i) {
  	    for (let j = 0; j < matrix.columns; ++j) {
  	      sum[i] += matrix.get(i, j);
  	    }
  	  }
  	  return sum;
  	}

  	function sumByColumn(matrix) {
  	  let sum = newArray(matrix.columns);
  	  for (let i = 0; i < matrix.rows; ++i) {
  	    for (let j = 0; j < matrix.columns; ++j) {
  	      sum[j] += matrix.get(i, j);
  	    }
  	  }
  	  return sum;
  	}

  	function sumAll(matrix) {
  	  let v = 0;
  	  for (let i = 0; i < matrix.rows; i++) {
  	    for (let j = 0; j < matrix.columns; j++) {
  	      v += matrix.get(i, j);
  	    }
  	  }
  	  return v;
  	}

  	function productByRow(matrix) {
  	  let sum = newArray(matrix.rows, 1);
  	  for (let i = 0; i < matrix.rows; ++i) {
  	    for (let j = 0; j < matrix.columns; ++j) {
  	      sum[i] *= matrix.get(i, j);
  	    }
  	  }
  	  return sum;
  	}

  	function productByColumn(matrix) {
  	  let sum = newArray(matrix.columns, 1);
  	  for (let i = 0; i < matrix.rows; ++i) {
  	    for (let j = 0; j < matrix.columns; ++j) {
  	      sum[j] *= matrix.get(i, j);
  	    }
  	  }
  	  return sum;
  	}

  	function productAll(matrix) {
  	  let v = 1;
  	  for (let i = 0; i < matrix.rows; i++) {
  	    for (let j = 0; j < matrix.columns; j++) {
  	      v *= matrix.get(i, j);
  	    }
  	  }
  	  return v;
  	}

  	function varianceByRow(matrix, unbiased, mean) {
  	  const rows = matrix.rows;
  	  const cols = matrix.columns;
  	  const variance = [];

  	  for (let i = 0; i < rows; i++) {
  	    let sum1 = 0;
  	    let sum2 = 0;
  	    let x = 0;
  	    for (let j = 0; j < cols; j++) {
  	      x = matrix.get(i, j) - mean[i];
  	      sum1 += x;
  	      sum2 += x * x;
  	    }
  	    if (unbiased) {
  	      variance.push((sum2 - (sum1 * sum1) / cols) / (cols - 1));
  	    } else {
  	      variance.push((sum2 - (sum1 * sum1) / cols) / cols);
  	    }
  	  }
  	  return variance;
  	}

  	function varianceByColumn(matrix, unbiased, mean) {
  	  const rows = matrix.rows;
  	  const cols = matrix.columns;
  	  const variance = [];

  	  for (let j = 0; j < cols; j++) {
  	    let sum1 = 0;
  	    let sum2 = 0;
  	    let x = 0;
  	    for (let i = 0; i < rows; i++) {
  	      x = matrix.get(i, j) - mean[j];
  	      sum1 += x;
  	      sum2 += x * x;
  	    }
  	    if (unbiased) {
  	      variance.push((sum2 - (sum1 * sum1) / rows) / (rows - 1));
  	    } else {
  	      variance.push((sum2 - (sum1 * sum1) / rows) / rows);
  	    }
  	  }
  	  return variance;
  	}

  	function varianceAll(matrix, unbiased, mean) {
  	  const rows = matrix.rows;
  	  const cols = matrix.columns;
  	  const size = rows * cols;

  	  let sum1 = 0;
  	  let sum2 = 0;
  	  let x = 0;
  	  for (let i = 0; i < rows; i++) {
  	    for (let j = 0; j < cols; j++) {
  	      x = matrix.get(i, j) - mean;
  	      sum1 += x;
  	      sum2 += x * x;
  	    }
  	  }
  	  if (unbiased) {
  	    return (sum2 - (sum1 * sum1) / size) / (size - 1);
  	  } else {
  	    return (sum2 - (sum1 * sum1) / size) / size;
  	  }
  	}

  	function centerByRow(matrix, mean) {
  	  for (let i = 0; i < matrix.rows; i++) {
  	    for (let j = 0; j < matrix.columns; j++) {
  	      matrix.set(i, j, matrix.get(i, j) - mean[i]);
  	    }
  	  }
  	}

  	function centerByColumn(matrix, mean) {
  	  for (let i = 0; i < matrix.rows; i++) {
  	    for (let j = 0; j < matrix.columns; j++) {
  	      matrix.set(i, j, matrix.get(i, j) - mean[j]);
  	    }
  	  }
  	}

  	function centerAll(matrix, mean) {
  	  for (let i = 0; i < matrix.rows; i++) {
  	    for (let j = 0; j < matrix.columns; j++) {
  	      matrix.set(i, j, matrix.get(i, j) - mean);
  	    }
  	  }
  	}

  	function getScaleByRow(matrix) {
  	  const scale = [];
  	  for (let i = 0; i < matrix.rows; i++) {
  	    let sum = 0;
  	    for (let j = 0; j < matrix.columns; j++) {
  	      sum += matrix.get(i, j) ** 2 / (matrix.columns - 1);
  	    }
  	    scale.push(Math.sqrt(sum));
  	  }
  	  return scale;
  	}

  	function scaleByRow(matrix, scale) {
  	  for (let i = 0; i < matrix.rows; i++) {
  	    for (let j = 0; j < matrix.columns; j++) {
  	      matrix.set(i, j, matrix.get(i, j) / scale[i]);
  	    }
  	  }
  	}

  	function getScaleByColumn(matrix) {
  	  const scale = [];
  	  for (let j = 0; j < matrix.columns; j++) {
  	    let sum = 0;
  	    for (let i = 0; i < matrix.rows; i++) {
  	      sum += matrix.get(i, j) ** 2 / (matrix.rows - 1);
  	    }
  	    scale.push(Math.sqrt(sum));
  	  }
  	  return scale;
  	}

  	function scaleByColumn(matrix, scale) {
  	  for (let i = 0; i < matrix.rows; i++) {
  	    for (let j = 0; j < matrix.columns; j++) {
  	      matrix.set(i, j, matrix.get(i, j) / scale[j]);
  	    }
  	  }
  	}

  	function getScaleAll(matrix) {
  	  const divider = matrix.size - 1;
  	  let sum = 0;
  	  for (let j = 0; j < matrix.columns; j++) {
  	    for (let i = 0; i < matrix.rows; i++) {
  	      sum += matrix.get(i, j) ** 2 / divider;
  	    }
  	  }
  	  return Math.sqrt(sum);
  	}

  	function scaleAll(matrix, scale) {
  	  for (let i = 0; i < matrix.rows; i++) {
  	    for (let j = 0; j < matrix.columns; j++) {
  	      matrix.set(i, j, matrix.get(i, j) / scale);
  	    }
  	  }
  	}

  	class AbstractMatrix {
  	  static from1DArray(newRows, newColumns, newData) {
  	    let length = newRows * newColumns;
  	    if (length !== newData.length) {
  	      throw new RangeError('data length does not match given dimensions');
  	    }
  	    let newMatrix = new Matrix(newRows, newColumns);
  	    for (let row = 0; row < newRows; row++) {
  	      for (let column = 0; column < newColumns; column++) {
  	        newMatrix.set(row, column, newData[row * newColumns + column]);
  	      }
  	    }
  	    return newMatrix;
  	  }

  	  static rowVector(newData) {
  	    let vector = new Matrix(1, newData.length);
  	    for (let i = 0; i < newData.length; i++) {
  	      vector.set(0, i, newData[i]);
  	    }
  	    return vector;
  	  }

  	  static columnVector(newData) {
  	    let vector = new Matrix(newData.length, 1);
  	    for (let i = 0; i < newData.length; i++) {
  	      vector.set(i, 0, newData[i]);
  	    }
  	    return vector;
  	  }

  	  static zeros(rows, columns) {
  	    return new Matrix(rows, columns);
  	  }

  	  static ones(rows, columns) {
  	    return new Matrix(rows, columns).fill(1);
  	  }

  	  static rand(rows, columns, options = {}) {
  	    if (typeof options !== 'object') {
  	      throw new TypeError('options must be an object');
  	    }
  	    const { random = Math.random } = options;
  	    let matrix = new Matrix(rows, columns);
  	    for (let i = 0; i < rows; i++) {
  	      for (let j = 0; j < columns; j++) {
  	        matrix.set(i, j, random());
  	      }
  	    }
  	    return matrix;
  	  }

  	  static randInt(rows, columns, options = {}) {
  	    if (typeof options !== 'object') {
  	      throw new TypeError('options must be an object');
  	    }
  	    const { min = 0, max = 1000, random = Math.random } = options;
  	    if (!Number.isInteger(min)) throw new TypeError('min must be an integer');
  	    if (!Number.isInteger(max)) throw new TypeError('max must be an integer');
  	    if (min >= max) throw new RangeError('min must be smaller than max');
  	    let interval = max - min;
  	    let matrix = new Matrix(rows, columns);
  	    for (let i = 0; i < rows; i++) {
  	      for (let j = 0; j < columns; j++) {
  	        let value = min + Math.round(random() * interval);
  	        matrix.set(i, j, value);
  	      }
  	    }
  	    return matrix;
  	  }

  	  static eye(rows, columns, value) {
  	    if (columns === undefined) columns = rows;
  	    if (value === undefined) value = 1;
  	    let min = Math.min(rows, columns);
  	    let matrix = this.zeros(rows, columns);
  	    for (let i = 0; i < min; i++) {
  	      matrix.set(i, i, value);
  	    }
  	    return matrix;
  	  }

  	  static diag(data, rows, columns) {
  	    let l = data.length;
  	    if (rows === undefined) rows = l;
  	    if (columns === undefined) columns = rows;
  	    let min = Math.min(l, rows, columns);
  	    let matrix = this.zeros(rows, columns);
  	    for (let i = 0; i < min; i++) {
  	      matrix.set(i, i, data[i]);
  	    }
  	    return matrix;
  	  }

  	  static min(matrix1, matrix2) {
  	    matrix1 = this.checkMatrix(matrix1);
  	    matrix2 = this.checkMatrix(matrix2);
  	    let rows = matrix1.rows;
  	    let columns = matrix1.columns;
  	    let result = new Matrix(rows, columns);
  	    for (let i = 0; i < rows; i++) {
  	      for (let j = 0; j < columns; j++) {
  	        result.set(i, j, Math.min(matrix1.get(i, j), matrix2.get(i, j)));
  	      }
  	    }
  	    return result;
  	  }

  	  static max(matrix1, matrix2) {
  	    matrix1 = this.checkMatrix(matrix1);
  	    matrix2 = this.checkMatrix(matrix2);
  	    let rows = matrix1.rows;
  	    let columns = matrix1.columns;
  	    let result = new this(rows, columns);
  	    for (let i = 0; i < rows; i++) {
  	      for (let j = 0; j < columns; j++) {
  	        result.set(i, j, Math.max(matrix1.get(i, j), matrix2.get(i, j)));
  	      }
  	    }
  	    return result;
  	  }

  	  static checkMatrix(value) {
  	    return AbstractMatrix.isMatrix(value) ? value : new Matrix(value);
  	  }

  	  static isMatrix(value) {
  	    return value != null && value.klass === 'Matrix';
  	  }

  	  get size() {
  	    return this.rows * this.columns;
  	  }

  	  apply(callback) {
  	    if (typeof callback !== 'function') {
  	      throw new TypeError('callback must be a function');
  	    }
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        callback.call(this, i, j);
  	      }
  	    }
  	    return this;
  	  }

  	  to1DArray() {
  	    let array = [];
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        array.push(this.get(i, j));
  	      }
  	    }
  	    return array;
  	  }

  	  to2DArray() {
  	    let copy = [];
  	    for (let i = 0; i < this.rows; i++) {
  	      copy.push([]);
  	      for (let j = 0; j < this.columns; j++) {
  	        copy[i].push(this.get(i, j));
  	      }
  	    }
  	    return copy;
  	  }

  	  toJSON() {
  	    return this.to2DArray();
  	  }

  	  isRowVector() {
  	    return this.rows === 1;
  	  }

  	  isColumnVector() {
  	    return this.columns === 1;
  	  }

  	  isVector() {
  	    return this.rows === 1 || this.columns === 1;
  	  }

  	  isSquare() {
  	    return this.rows === this.columns;
  	  }

  	  isEmpty() {
  	    return this.rows === 0 || this.columns === 0;
  	  }

  	  isSymmetric() {
  	    if (this.isSquare()) {
  	      for (let i = 0; i < this.rows; i++) {
  	        for (let j = 0; j <= i; j++) {
  	          if (this.get(i, j) !== this.get(j, i)) {
  	            return false;
  	          }
  	        }
  	      }
  	      return true;
  	    }
  	    return false;
  	  }

  	  isDistance() {
  	    if (!this.isSymmetric()) return false;

  	    for (let i = 0; i < this.rows; i++) {
  	      if (this.get(i, i) !== 0) return false;
  	    }

  	    return true;
  	  }

  	  isEchelonForm() {
  	    let i = 0;
  	    let j = 0;
  	    let previousColumn = -1;
  	    let isEchelonForm = true;
  	    let checked = false;
  	    while (i < this.rows && isEchelonForm) {
  	      j = 0;
  	      checked = false;
  	      while (j < this.columns && checked === false) {
  	        if (this.get(i, j) === 0) {
  	          j++;
  	        } else if (this.get(i, j) === 1 && j > previousColumn) {
  	          checked = true;
  	          previousColumn = j;
  	        } else {
  	          isEchelonForm = false;
  	          checked = true;
  	        }
  	      }
  	      i++;
  	    }
  	    return isEchelonForm;
  	  }

  	  isReducedEchelonForm() {
  	    let i = 0;
  	    let j = 0;
  	    let previousColumn = -1;
  	    let isReducedEchelonForm = true;
  	    let checked = false;
  	    while (i < this.rows && isReducedEchelonForm) {
  	      j = 0;
  	      checked = false;
  	      while (j < this.columns && checked === false) {
  	        if (this.get(i, j) === 0) {
  	          j++;
  	        } else if (this.get(i, j) === 1 && j > previousColumn) {
  	          checked = true;
  	          previousColumn = j;
  	        } else {
  	          isReducedEchelonForm = false;
  	          checked = true;
  	        }
  	      }
  	      for (let k = j + 1; k < this.rows; k++) {
  	        if (this.get(i, k) !== 0) {
  	          isReducedEchelonForm = false;
  	        }
  	      }
  	      i++;
  	    }
  	    return isReducedEchelonForm;
  	  }

  	  echelonForm() {
  	    let result = this.clone();
  	    let h = 0;
  	    let k = 0;
  	    while (h < result.rows && k < result.columns) {
  	      let iMax = h;
  	      for (let i = h; i < result.rows; i++) {
  	        if (result.get(i, k) > result.get(iMax, k)) {
  	          iMax = i;
  	        }
  	      }
  	      if (result.get(iMax, k) === 0) {
  	        k++;
  	      } else {
  	        result.swapRows(h, iMax);
  	        let tmp = result.get(h, k);
  	        for (let j = k; j < result.columns; j++) {
  	          result.set(h, j, result.get(h, j) / tmp);
  	        }
  	        for (let i = h + 1; i < result.rows; i++) {
  	          let factor = result.get(i, k) / result.get(h, k);
  	          result.set(i, k, 0);
  	          for (let j = k + 1; j < result.columns; j++) {
  	            result.set(i, j, result.get(i, j) - result.get(h, j) * factor);
  	          }
  	        }
  	        h++;
  	        k++;
  	      }
  	    }
  	    return result;
  	  }

  	  reducedEchelonForm() {
  	    let result = this.echelonForm();
  	    let m = result.columns;
  	    let n = result.rows;
  	    let h = n - 1;
  	    while (h >= 0) {
  	      if (result.maxRow(h) === 0) {
  	        h--;
  	      } else {
  	        let p = 0;
  	        let pivot = false;
  	        while (p < n && pivot === false) {
  	          if (result.get(h, p) === 1) {
  	            pivot = true;
  	          } else {
  	            p++;
  	          }
  	        }
  	        for (let i = 0; i < h; i++) {
  	          let factor = result.get(i, p);
  	          for (let j = p; j < m; j++) {
  	            let tmp = result.get(i, j) - factor * result.get(h, j);
  	            result.set(i, j, tmp);
  	          }
  	        }
  	        h--;
  	      }
  	    }
  	    return result;
  	  }

  	  set() {
  	    throw new Error('set method is unimplemented');
  	  }

  	  get() {
  	    throw new Error('get method is unimplemented');
  	  }

  	  repeat(options = {}) {
  	    if (typeof options !== 'object') {
  	      throw new TypeError('options must be an object');
  	    }
  	    const { rows = 1, columns = 1 } = options;
  	    if (!Number.isInteger(rows) || rows <= 0) {
  	      throw new TypeError('rows must be a positive integer');
  	    }
  	    if (!Number.isInteger(columns) || columns <= 0) {
  	      throw new TypeError('columns must be a positive integer');
  	    }
  	    let matrix = new Matrix(this.rows * rows, this.columns * columns);
  	    for (let i = 0; i < rows; i++) {
  	      for (let j = 0; j < columns; j++) {
  	        matrix.setSubMatrix(this, this.rows * i, this.columns * j);
  	      }
  	    }
  	    return matrix;
  	  }

  	  fill(value) {
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, value);
  	      }
  	    }
  	    return this;
  	  }

  	  neg() {
  	    return this.mulS(-1);
  	  }

  	  getRow(index) {
  	    checkRowIndex(this, index);
  	    let row = [];
  	    for (let i = 0; i < this.columns; i++) {
  	      row.push(this.get(index, i));
  	    }
  	    return row;
  	  }

  	  getRowVector(index) {
  	    return Matrix.rowVector(this.getRow(index));
  	  }

  	  setRow(index, array) {
  	    checkRowIndex(this, index);
  	    array = checkRowVector(this, array);
  	    for (let i = 0; i < this.columns; i++) {
  	      this.set(index, i, array[i]);
  	    }
  	    return this;
  	  }

  	  swapRows(row1, row2) {
  	    checkRowIndex(this, row1);
  	    checkRowIndex(this, row2);
  	    for (let i = 0; i < this.columns; i++) {
  	      let temp = this.get(row1, i);
  	      this.set(row1, i, this.get(row2, i));
  	      this.set(row2, i, temp);
  	    }
  	    return this;
  	  }

  	  getColumn(index) {
  	    checkColumnIndex(this, index);
  	    let column = [];
  	    for (let i = 0; i < this.rows; i++) {
  	      column.push(this.get(i, index));
  	    }
  	    return column;
  	  }

  	  getColumnVector(index) {
  	    return Matrix.columnVector(this.getColumn(index));
  	  }

  	  setColumn(index, array) {
  	    checkColumnIndex(this, index);
  	    array = checkColumnVector(this, array);
  	    for (let i = 0; i < this.rows; i++) {
  	      this.set(i, index, array[i]);
  	    }
  	    return this;
  	  }

  	  swapColumns(column1, column2) {
  	    checkColumnIndex(this, column1);
  	    checkColumnIndex(this, column2);
  	    for (let i = 0; i < this.rows; i++) {
  	      let temp = this.get(i, column1);
  	      this.set(i, column1, this.get(i, column2));
  	      this.set(i, column2, temp);
  	    }
  	    return this;
  	  }

  	  addRowVector(vector) {
  	    vector = checkRowVector(this, vector);
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) + vector[j]);
  	      }
  	    }
  	    return this;
  	  }

  	  subRowVector(vector) {
  	    vector = checkRowVector(this, vector);
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) - vector[j]);
  	      }
  	    }
  	    return this;
  	  }

  	  mulRowVector(vector) {
  	    vector = checkRowVector(this, vector);
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) * vector[j]);
  	      }
  	    }
  	    return this;
  	  }

  	  divRowVector(vector) {
  	    vector = checkRowVector(this, vector);
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) / vector[j]);
  	      }
  	    }
  	    return this;
  	  }

  	  addColumnVector(vector) {
  	    vector = checkColumnVector(this, vector);
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) + vector[i]);
  	      }
  	    }
  	    return this;
  	  }

  	  subColumnVector(vector) {
  	    vector = checkColumnVector(this, vector);
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) - vector[i]);
  	      }
  	    }
  	    return this;
  	  }

  	  mulColumnVector(vector) {
  	    vector = checkColumnVector(this, vector);
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) * vector[i]);
  	      }
  	    }
  	    return this;
  	  }

  	  divColumnVector(vector) {
  	    vector = checkColumnVector(this, vector);
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        this.set(i, j, this.get(i, j) / vector[i]);
  	      }
  	    }
  	    return this;
  	  }

  	  mulRow(index, value) {
  	    checkRowIndex(this, index);
  	    for (let i = 0; i < this.columns; i++) {
  	      this.set(index, i, this.get(index, i) * value);
  	    }
  	    return this;
  	  }

  	  mulColumn(index, value) {
  	    checkColumnIndex(this, index);
  	    for (let i = 0; i < this.rows; i++) {
  	      this.set(i, index, this.get(i, index) * value);
  	    }
  	    return this;
  	  }

  	  max(by) {
  	    if (this.isEmpty()) {
  	      return NaN;
  	    }
  	    switch (by) {
  	      case 'row': {
  	        const max = new Array(this.rows).fill(Number.NEGATIVE_INFINITY);
  	        for (let row = 0; row < this.rows; row++) {
  	          for (let column = 0; column < this.columns; column++) {
  	            if (this.get(row, column) > max[row]) {
  	              max[row] = this.get(row, column);
  	            }
  	          }
  	        }
  	        return max;
  	      }
  	      case 'column': {
  	        const max = new Array(this.columns).fill(Number.NEGATIVE_INFINITY);
  	        for (let row = 0; row < this.rows; row++) {
  	          for (let column = 0; column < this.columns; column++) {
  	            if (this.get(row, column) > max[column]) {
  	              max[column] = this.get(row, column);
  	            }
  	          }
  	        }
  	        return max;
  	      }
  	      case undefined: {
  	        let max = this.get(0, 0);
  	        for (let row = 0; row < this.rows; row++) {
  	          for (let column = 0; column < this.columns; column++) {
  	            if (this.get(row, column) > max) {
  	              max = this.get(row, column);
  	            }
  	          }
  	        }
  	        return max;
  	      }
  	      default:
  	        throw new Error(`invalid option: ${by}`);
  	    }
  	  }

  	  maxIndex() {
  	    checkNonEmpty(this);
  	    let v = this.get(0, 0);
  	    let idx = [0, 0];
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        if (this.get(i, j) > v) {
  	          v = this.get(i, j);
  	          idx[0] = i;
  	          idx[1] = j;
  	        }
  	      }
  	    }
  	    return idx;
  	  }

  	  min(by) {
  	    if (this.isEmpty()) {
  	      return NaN;
  	    }

  	    switch (by) {
  	      case 'row': {
  	        const min = new Array(this.rows).fill(Number.POSITIVE_INFINITY);
  	        for (let row = 0; row < this.rows; row++) {
  	          for (let column = 0; column < this.columns; column++) {
  	            if (this.get(row, column) < min[row]) {
  	              min[row] = this.get(row, column);
  	            }
  	          }
  	        }
  	        return min;
  	      }
  	      case 'column': {
  	        const min = new Array(this.columns).fill(Number.POSITIVE_INFINITY);
  	        for (let row = 0; row < this.rows; row++) {
  	          for (let column = 0; column < this.columns; column++) {
  	            if (this.get(row, column) < min[column]) {
  	              min[column] = this.get(row, column);
  	            }
  	          }
  	        }
  	        return min;
  	      }
  	      case undefined: {
  	        let min = this.get(0, 0);
  	        for (let row = 0; row < this.rows; row++) {
  	          for (let column = 0; column < this.columns; column++) {
  	            if (this.get(row, column) < min) {
  	              min = this.get(row, column);
  	            }
  	          }
  	        }
  	        return min;
  	      }
  	      default:
  	        throw new Error(`invalid option: ${by}`);
  	    }
  	  }

  	  minIndex() {
  	    checkNonEmpty(this);
  	    let v = this.get(0, 0);
  	    let idx = [0, 0];
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        if (this.get(i, j) < v) {
  	          v = this.get(i, j);
  	          idx[0] = i;
  	          idx[1] = j;
  	        }
  	      }
  	    }
  	    return idx;
  	  }

  	  maxRow(row) {
  	    checkRowIndex(this, row);
  	    if (this.isEmpty()) {
  	      return NaN;
  	    }
  	    let v = this.get(row, 0);
  	    for (let i = 1; i < this.columns; i++) {
  	      if (this.get(row, i) > v) {
  	        v = this.get(row, i);
  	      }
  	    }
  	    return v;
  	  }

  	  maxRowIndex(row) {
  	    checkRowIndex(this, row);
  	    checkNonEmpty(this);
  	    let v = this.get(row, 0);
  	    let idx = [row, 0];
  	    for (let i = 1; i < this.columns; i++) {
  	      if (this.get(row, i) > v) {
  	        v = this.get(row, i);
  	        idx[1] = i;
  	      }
  	    }
  	    return idx;
  	  }

  	  minRow(row) {
  	    checkRowIndex(this, row);
  	    if (this.isEmpty()) {
  	      return NaN;
  	    }
  	    let v = this.get(row, 0);
  	    for (let i = 1; i < this.columns; i++) {
  	      if (this.get(row, i) < v) {
  	        v = this.get(row, i);
  	      }
  	    }
  	    return v;
  	  }

  	  minRowIndex(row) {
  	    checkRowIndex(this, row);
  	    checkNonEmpty(this);
  	    let v = this.get(row, 0);
  	    let idx = [row, 0];
  	    for (let i = 1; i < this.columns; i++) {
  	      if (this.get(row, i) < v) {
  	        v = this.get(row, i);
  	        idx[1] = i;
  	      }
  	    }
  	    return idx;
  	  }

  	  maxColumn(column) {
  	    checkColumnIndex(this, column);
  	    if (this.isEmpty()) {
  	      return NaN;
  	    }
  	    let v = this.get(0, column);
  	    for (let i = 1; i < this.rows; i++) {
  	      if (this.get(i, column) > v) {
  	        v = this.get(i, column);
  	      }
  	    }
  	    return v;
  	  }

  	  maxColumnIndex(column) {
  	    checkColumnIndex(this, column);
  	    checkNonEmpty(this);
  	    let v = this.get(0, column);
  	    let idx = [0, column];
  	    for (let i = 1; i < this.rows; i++) {
  	      if (this.get(i, column) > v) {
  	        v = this.get(i, column);
  	        idx[0] = i;
  	      }
  	    }
  	    return idx;
  	  }

  	  minColumn(column) {
  	    checkColumnIndex(this, column);
  	    if (this.isEmpty()) {
  	      return NaN;
  	    }
  	    let v = this.get(0, column);
  	    for (let i = 1; i < this.rows; i++) {
  	      if (this.get(i, column) < v) {
  	        v = this.get(i, column);
  	      }
  	    }
  	    return v;
  	  }

  	  minColumnIndex(column) {
  	    checkColumnIndex(this, column);
  	    checkNonEmpty(this);
  	    let v = this.get(0, column);
  	    let idx = [0, column];
  	    for (let i = 1; i < this.rows; i++) {
  	      if (this.get(i, column) < v) {
  	        v = this.get(i, column);
  	        idx[0] = i;
  	      }
  	    }
  	    return idx;
  	  }

  	  diag() {
  	    let min = Math.min(this.rows, this.columns);
  	    let diag = [];
  	    for (let i = 0; i < min; i++) {
  	      diag.push(this.get(i, i));
  	    }
  	    return diag;
  	  }

  	  norm(type = 'frobenius') {
  	    switch (type) {
  	      case 'max':
  	        return this.max();
  	      case 'frobenius':
  	        return Math.sqrt(this.dot(this));
  	      default:
  	        throw new RangeError(`unknown norm type: ${type}`);
  	    }
  	  }

  	  cumulativeSum() {
  	    let sum = 0;
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        sum += this.get(i, j);
  	        this.set(i, j, sum);
  	      }
  	    }
  	    return this;
  	  }

  	  dot(vector2) {
  	    if (AbstractMatrix.isMatrix(vector2)) vector2 = vector2.to1DArray();
  	    let vector1 = this.to1DArray();
  	    if (vector1.length !== vector2.length) {
  	      throw new RangeError('vectors do not have the same size');
  	    }
  	    let dot = 0;
  	    for (let i = 0; i < vector1.length; i++) {
  	      dot += vector1[i] * vector2[i];
  	    }
  	    return dot;
  	  }

  	  mmul(other) {
  	    other = Matrix.checkMatrix(other);

  	    let m = this.rows;
  	    let n = this.columns;
  	    let p = other.columns;

  	    let result = new Matrix(m, p);

  	    let Bcolj = new Float64Array(n);
  	    for (let j = 0; j < p; j++) {
  	      for (let k = 0; k < n; k++) {
  	        Bcolj[k] = other.get(k, j);
  	      }

  	      for (let i = 0; i < m; i++) {
  	        let s = 0;
  	        for (let k = 0; k < n; k++) {
  	          s += this.get(i, k) * Bcolj[k];
  	        }

  	        result.set(i, j, s);
  	      }
  	    }
  	    return result;
  	  }

  	  mpow(scalar) {
  	    if (!this.isSquare()) {
  	      throw new RangeError('Matrix must be square');
  	    }
  	    if (!Number.isInteger(scalar) || scalar < 0) {
  	      throw new RangeError('Exponent must be a non-negative integer');
  	    }
  	    // Russian Peasant exponentiation, i.e. exponentiation by squaring
  	    let result = Matrix.eye(this.rows);
  	    let bb = this;
  	    // Note: Don't bit shift. In JS, that would truncate at 32 bits
  	    for (let e = scalar; e >= 1; e /= 2) {
  	      if ((e & 1) !== 0) {
  	        result = result.mmul(bb);
  	      }
  	      bb = bb.mmul(bb);
  	    }
  	    return result;
  	  }

  	  strassen2x2(other) {
  	    other = Matrix.checkMatrix(other);
  	    let result = new Matrix(2, 2);
  	    const a11 = this.get(0, 0);
  	    const b11 = other.get(0, 0);
  	    const a12 = this.get(0, 1);
  	    const b12 = other.get(0, 1);
  	    const a21 = this.get(1, 0);
  	    const b21 = other.get(1, 0);
  	    const a22 = this.get(1, 1);
  	    const b22 = other.get(1, 1);

  	    // Compute intermediate values.
  	    const m1 = (a11 + a22) * (b11 + b22);
  	    const m2 = (a21 + a22) * b11;
  	    const m3 = a11 * (b12 - b22);
  	    const m4 = a22 * (b21 - b11);
  	    const m5 = (a11 + a12) * b22;
  	    const m6 = (a21 - a11) * (b11 + b12);
  	    const m7 = (a12 - a22) * (b21 + b22);

  	    // Combine intermediate values into the output.
  	    const c00 = m1 + m4 - m5 + m7;
  	    const c01 = m3 + m5;
  	    const c10 = m2 + m4;
  	    const c11 = m1 - m2 + m3 + m6;

  	    result.set(0, 0, c00);
  	    result.set(0, 1, c01);
  	    result.set(1, 0, c10);
  	    result.set(1, 1, c11);
  	    return result;
  	  }

  	  strassen3x3(other) {
  	    other = Matrix.checkMatrix(other);
  	    let result = new Matrix(3, 3);

  	    const a00 = this.get(0, 0);
  	    const a01 = this.get(0, 1);
  	    const a02 = this.get(0, 2);
  	    const a10 = this.get(1, 0);
  	    const a11 = this.get(1, 1);
  	    const a12 = this.get(1, 2);
  	    const a20 = this.get(2, 0);
  	    const a21 = this.get(2, 1);
  	    const a22 = this.get(2, 2);

  	    const b00 = other.get(0, 0);
  	    const b01 = other.get(0, 1);
  	    const b02 = other.get(0, 2);
  	    const b10 = other.get(1, 0);
  	    const b11 = other.get(1, 1);
  	    const b12 = other.get(1, 2);
  	    const b20 = other.get(2, 0);
  	    const b21 = other.get(2, 1);
  	    const b22 = other.get(2, 2);

  	    const m1 = (a00 + a01 + a02 - a10 - a11 - a21 - a22) * b11;
  	    const m2 = (a00 - a10) * (-b01 + b11);
  	    const m3 = a11 * (-b00 + b01 + b10 - b11 - b12 - b20 + b22);
  	    const m4 = (-a00 + a10 + a11) * (b00 - b01 + b11);
  	    const m5 = (a10 + a11) * (-b00 + b01);
  	    const m6 = a00 * b00;
  	    const m7 = (-a00 + a20 + a21) * (b00 - b02 + b12);
  	    const m8 = (-a00 + a20) * (b02 - b12);
  	    const m9 = (a20 + a21) * (-b00 + b02);
  	    const m10 = (a00 + a01 + a02 - a11 - a12 - a20 - a21) * b12;
  	    const m11 = a21 * (-b00 + b02 + b10 - b11 - b12 - b20 + b21);
  	    const m12 = (-a02 + a21 + a22) * (b11 + b20 - b21);
  	    const m13 = (a02 - a22) * (b11 - b21);
  	    const m14 = a02 * b20;
  	    const m15 = (a21 + a22) * (-b20 + b21);
  	    const m16 = (-a02 + a11 + a12) * (b12 + b20 - b22);
  	    const m17 = (a02 - a12) * (b12 - b22);
  	    const m18 = (a11 + a12) * (-b20 + b22);
  	    const m19 = a01 * b10;
  	    const m20 = a12 * b21;
  	    const m21 = a10 * b02;
  	    const m22 = a20 * b01;
  	    const m23 = a22 * b22;

  	    const c00 = m6 + m14 + m19;
  	    const c01 = m1 + m4 + m5 + m6 + m12 + m14 + m15;
  	    const c02 = m6 + m7 + m9 + m10 + m14 + m16 + m18;
  	    const c10 = m2 + m3 + m4 + m6 + m14 + m16 + m17;
  	    const c11 = m2 + m4 + m5 + m6 + m20;
  	    const c12 = m14 + m16 + m17 + m18 + m21;
  	    const c20 = m6 + m7 + m8 + m11 + m12 + m13 + m14;
  	    const c21 = m12 + m13 + m14 + m15 + m22;
  	    const c22 = m6 + m7 + m8 + m9 + m23;

  	    result.set(0, 0, c00);
  	    result.set(0, 1, c01);
  	    result.set(0, 2, c02);
  	    result.set(1, 0, c10);
  	    result.set(1, 1, c11);
  	    result.set(1, 2, c12);
  	    result.set(2, 0, c20);
  	    result.set(2, 1, c21);
  	    result.set(2, 2, c22);
  	    return result;
  	  }

  	  mmulStrassen(y) {
  	    y = Matrix.checkMatrix(y);
  	    let x = this.clone();
  	    let r1 = x.rows;
  	    let c1 = x.columns;
  	    let r2 = y.rows;
  	    let c2 = y.columns;
  	    if (c1 !== r2) {
  	      // eslint-disable-next-line no-console
  	      console.warn(
  	        `Multiplying ${r1} x ${c1} and ${r2} x ${c2} matrix: dimensions do not match.`,
  	      );
  	    }

  	    // Put a matrix into the top left of a matrix of zeros.
  	    // `rows` and `cols` are the dimensions of the output matrix.
  	    function embed(mat, rows, cols) {
  	      let r = mat.rows;
  	      let c = mat.columns;
  	      if (r === rows && c === cols) {
  	        return mat;
  	      } else {
  	        let resultat = AbstractMatrix.zeros(rows, cols);
  	        resultat = resultat.setSubMatrix(mat, 0, 0);
  	        return resultat;
  	      }
  	    }

  	    // Make sure both matrices are the same size.
  	    // This is exclusively for simplicity:
  	    // this algorithm can be implemented with matrices of different sizes.

  	    let r = Math.max(r1, r2);
  	    let c = Math.max(c1, c2);
  	    x = embed(x, r, c);
  	    y = embed(y, r, c);

  	    // Our recursive multiplication function.
  	    function blockMult(a, b, rows, cols) {
  	      // For small matrices, resort to naive multiplication.
  	      if (rows <= 512 || cols <= 512) {
  	        return a.mmul(b); // a is equivalent to this
  	      }

  	      // Apply dynamic padding.
  	      if (rows % 2 === 1 && cols % 2 === 1) {
  	        a = embed(a, rows + 1, cols + 1);
  	        b = embed(b, rows + 1, cols + 1);
  	      } else if (rows % 2 === 1) {
  	        a = embed(a, rows + 1, cols);
  	        b = embed(b, rows + 1, cols);
  	      } else if (cols % 2 === 1) {
  	        a = embed(a, rows, cols + 1);
  	        b = embed(b, rows, cols + 1);
  	      }

  	      let halfRows = parseInt(a.rows / 2, 10);
  	      let halfCols = parseInt(a.columns / 2, 10);
  	      // Subdivide input matrices.
  	      let a11 = a.subMatrix(0, halfRows - 1, 0, halfCols - 1);
  	      let b11 = b.subMatrix(0, halfRows - 1, 0, halfCols - 1);

  	      let a12 = a.subMatrix(0, halfRows - 1, halfCols, a.columns - 1);
  	      let b12 = b.subMatrix(0, halfRows - 1, halfCols, b.columns - 1);

  	      let a21 = a.subMatrix(halfRows, a.rows - 1, 0, halfCols - 1);
  	      let b21 = b.subMatrix(halfRows, b.rows - 1, 0, halfCols - 1);

  	      let a22 = a.subMatrix(halfRows, a.rows - 1, halfCols, a.columns - 1);
  	      let b22 = b.subMatrix(halfRows, b.rows - 1, halfCols, b.columns - 1);

  	      // Compute intermediate values.
  	      let m1 = blockMult(
  	        AbstractMatrix.add(a11, a22),
  	        AbstractMatrix.add(b11, b22),
  	        halfRows,
  	        halfCols,
  	      );
  	      let m2 = blockMult(AbstractMatrix.add(a21, a22), b11, halfRows, halfCols);
  	      let m3 = blockMult(a11, AbstractMatrix.sub(b12, b22), halfRows, halfCols);
  	      let m4 = blockMult(a22, AbstractMatrix.sub(b21, b11), halfRows, halfCols);
  	      let m5 = blockMult(AbstractMatrix.add(a11, a12), b22, halfRows, halfCols);
  	      let m6 = blockMult(
  	        AbstractMatrix.sub(a21, a11),
  	        AbstractMatrix.add(b11, b12),
  	        halfRows,
  	        halfCols,
  	      );
  	      let m7 = blockMult(
  	        AbstractMatrix.sub(a12, a22),
  	        AbstractMatrix.add(b21, b22),
  	        halfRows,
  	        halfCols,
  	      );

  	      // Combine intermediate values into the output.
  	      let c11 = AbstractMatrix.add(m1, m4);
  	      c11.sub(m5);
  	      c11.add(m7);
  	      let c12 = AbstractMatrix.add(m3, m5);
  	      let c21 = AbstractMatrix.add(m2, m4);
  	      let c22 = AbstractMatrix.sub(m1, m2);
  	      c22.add(m3);
  	      c22.add(m6);

  	      // Crop output to the desired size (undo dynamic padding).
  	      let result = AbstractMatrix.zeros(2 * c11.rows, 2 * c11.columns);
  	      result = result.setSubMatrix(c11, 0, 0);
  	      result = result.setSubMatrix(c12, c11.rows, 0);
  	      result = result.setSubMatrix(c21, 0, c11.columns);
  	      result = result.setSubMatrix(c22, c11.rows, c11.columns);
  	      return result.subMatrix(0, rows - 1, 0, cols - 1);
  	    }

  	    return blockMult(x, y, r, c);
  	  }

  	  scaleRows(options = {}) {
  	    if (typeof options !== 'object') {
  	      throw new TypeError('options must be an object');
  	    }
  	    const { min = 0, max = 1 } = options;
  	    if (!Number.isFinite(min)) throw new TypeError('min must be a number');
  	    if (!Number.isFinite(max)) throw new TypeError('max must be a number');
  	    if (min >= max) throw new RangeError('min must be smaller than max');
  	    let newMatrix = new Matrix(this.rows, this.columns);
  	    for (let i = 0; i < this.rows; i++) {
  	      const row = this.getRow(i);
  	      if (row.length > 0) {
  	        rescale(row, { min, max, output: row });
  	      }
  	      newMatrix.setRow(i, row);
  	    }
  	    return newMatrix;
  	  }

  	  scaleColumns(options = {}) {
  	    if (typeof options !== 'object') {
  	      throw new TypeError('options must be an object');
  	    }
  	    const { min = 0, max = 1 } = options;
  	    if (!Number.isFinite(min)) throw new TypeError('min must be a number');
  	    if (!Number.isFinite(max)) throw new TypeError('max must be a number');
  	    if (min >= max) throw new RangeError('min must be smaller than max');
  	    let newMatrix = new Matrix(this.rows, this.columns);
  	    for (let i = 0; i < this.columns; i++) {
  	      const column = this.getColumn(i);
  	      if (column.length) {
  	        rescale(column, {
  	          min,
  	          max,
  	          output: column,
  	        });
  	      }
  	      newMatrix.setColumn(i, column);
  	    }
  	    return newMatrix;
  	  }

  	  flipRows() {
  	    const middle = Math.ceil(this.columns / 2);
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < middle; j++) {
  	        let first = this.get(i, j);
  	        let last = this.get(i, this.columns - 1 - j);
  	        this.set(i, j, last);
  	        this.set(i, this.columns - 1 - j, first);
  	      }
  	    }
  	    return this;
  	  }

  	  flipColumns() {
  	    const middle = Math.ceil(this.rows / 2);
  	    for (let j = 0; j < this.columns; j++) {
  	      for (let i = 0; i < middle; i++) {
  	        let first = this.get(i, j);
  	        let last = this.get(this.rows - 1 - i, j);
  	        this.set(i, j, last);
  	        this.set(this.rows - 1 - i, j, first);
  	      }
  	    }
  	    return this;
  	  }

  	  kroneckerProduct(other) {
  	    other = Matrix.checkMatrix(other);

  	    let m = this.rows;
  	    let n = this.columns;
  	    let p = other.rows;
  	    let q = other.columns;

  	    let result = new Matrix(m * p, n * q);
  	    for (let i = 0; i < m; i++) {
  	      for (let j = 0; j < n; j++) {
  	        for (let k = 0; k < p; k++) {
  	          for (let l = 0; l < q; l++) {
  	            result.set(p * i + k, q * j + l, this.get(i, j) * other.get(k, l));
  	          }
  	        }
  	      }
  	    }
  	    return result;
  	  }

  	  kroneckerSum(other) {
  	    other = Matrix.checkMatrix(other);
  	    if (!this.isSquare() || !other.isSquare()) {
  	      throw new Error('Kronecker Sum needs two Square Matrices');
  	    }
  	    let m = this.rows;
  	    let n = other.rows;
  	    let AxI = this.kroneckerProduct(Matrix.eye(n, n));
  	    let IxB = Matrix.eye(m, m).kroneckerProduct(other);
  	    return AxI.add(IxB);
  	  }

  	  transpose() {
  	    let result = new Matrix(this.columns, this.rows);
  	    for (let i = 0; i < this.rows; i++) {
  	      for (let j = 0; j < this.columns; j++) {
  	        result.set(j, i, this.get(i, j));
  	      }
  	    }
  	    return result;
  	  }

  	  sortRows(compareFunction = compareNumbers) {
  	    for (let i = 0; i < this.rows; i++) {
  	      this.setRow(i, this.getRow(i).sort(compareFunction));
  	    }
  	    return this;
  	  }

  	  sortColumns(compareFunction = compareNumbers) {
  	    for (let i = 0; i < this.columns; i++) {
  	      this.setColumn(i, this.getColumn(i).sort(compareFunction));
  	    }
  	    return this;
  	  }

  	  subMatrix(startRow, endRow, startColumn, endColumn) {
  	    checkRange(this, startRow, endRow, startColumn, endColumn);
  	    let newMatrix = new Matrix(
  	      endRow - startRow + 1,
  	      endColumn - startColumn + 1,
  	    );
  	    for (let i = startRow; i <= endRow; i++) {
  	      for (let j = startColumn; j <= endColumn; j++) {
  	        newMatrix.set(i - startRow, j - startColumn, this.get(i, j));
  	      }
  	    }
  	    return newMatrix;
  	  }

  	  subMatrixRow(indices, startColumn, endColumn) {
  	    if (startColumn === undefined) startColumn = 0;
  	    if (endColumn === undefined) endColumn = this.columns - 1;
  	    if (
  	      startColumn > endColumn ||
  	      startColumn < 0 ||
  	      startColumn >= this.columns ||
  	      endColumn < 0 ||
  	      endColumn >= this.columns
  	    ) {
  	      throw new RangeError('Argument out of range');
  	    }

  	    let newMatrix = new Matrix(indices.length, endColumn - startColumn + 1);
  	    for (let i = 0; i < indices.length; i++) {
  	      for (let j = startColumn; j <= endColumn; j++) {
  	        if (indices[i] < 0 || indices[i] >= this.rows) {
  	          throw new RangeError(`Row index out of range: ${indices[i]}`);
  	        }
  	        newMatrix.set(i, j - startColumn, this.get(indices[i], j));
  	      }
  	    }
  	    return newMatrix;
  	  }

  	  subMatrixColumn(indices, startRow, endRow) {
  	    if (startRow === undefined) startRow = 0;
  	    if (endRow === undefined) endRow = this.rows - 1;
  	    if (
  	      startRow > endRow ||
  	      startRow < 0 ||
  	      startRow >= this.rows ||
  	      endRow < 0 ||
  	      endRow >= this.rows
  	    ) {
  	      throw new RangeError('Argument out of range');
  	    }

  	    let newMatrix = new Matrix(endRow - startRow + 1, indices.length);
  	    for (let i = 0; i < indices.length; i++) {
  	      for (let j = startRow; j <= endRow; j++) {
  	        if (indices[i] < 0 || indices[i] >= this.columns) {
  	          throw new RangeError(`Column index out of range: ${indices[i]}`);
  	        }
  	        newMatrix.set(j - startRow, i, this.get(j, indices[i]));
  	      }
  	    }
  	    return newMatrix;
  	  }

  	  setSubMatrix(matrix, startRow, startColumn) {
  	    matrix = Matrix.checkMatrix(matrix);
  	    if (matrix.isEmpty()) {
  	      return this;
  	    }
  	    let endRow = startRow + matrix.rows - 1;
  	    let endColumn = startColumn + matrix.columns - 1;
  	    checkRange(this, startRow, endRow, startColumn, endColumn);
  	    for (let i = 0; i < matrix.rows; i++) {
  	      for (let j = 0; j < matrix.columns; j++) {
  	        this.set(startRow + i, startColumn + j, matrix.get(i, j));
  	      }
  	    }
  	    return this;
  	  }

  	  selection(rowIndices, columnIndices) {
  	    checkRowIndices(this, rowIndices);
  	    checkColumnIndices(this, columnIndices);
  	    let newMatrix = new Matrix(rowIndices.length, columnIndices.length);
  	    for (let i = 0; i < rowIndices.length; i++) {
  	      let rowIndex = rowIndices[i];
  	      for (let j = 0; j < columnIndices.length; j++) {
  	        let columnIndex = columnIndices[j];
  	        newMatrix.set(i, j, this.get(rowIndex, columnIndex));
  	      }
  	    }
  	    return newMatrix;
  	  }

  	  trace() {
  	    let min = Math.min(this.rows, this.columns);
  	    let trace = 0;
  	    for (let i = 0; i < min; i++) {
  	      trace += this.get(i, i);
  	    }
  	    return trace;
  	  }

  	  clone() {
  	    return this.constructor.copy(this, new Matrix(this.rows, this.columns));
  	  }

  	  /**
  	   * @template {AbstractMatrix} M
  	   * @param {AbstractMatrix} from
  	   * @param {M} to
  	   * @return {M}
  	   */
  	  static copy(from, to) {
  	    for (const [row, column, value] of from.entries()) {
  	      to.set(row, column, value);
  	    }

  	    return to;
  	  }

  	  sum(by) {
  	    switch (by) {
  	      case 'row':
  	        return sumByRow(this);
  	      case 'column':
  	        return sumByColumn(this);
  	      case undefined:
  	        return sumAll(this);
  	      default:
  	        throw new Error(`invalid option: ${by}`);
  	    }
  	  }

  	  product(by) {
  	    switch (by) {
  	      case 'row':
  	        return productByRow(this);
  	      case 'column':
  	        return productByColumn(this);
  	      case undefined:
  	        return productAll(this);
  	      default:
  	        throw new Error(`invalid option: ${by}`);
  	    }
  	  }

  	  mean(by) {
  	    const sum = this.sum(by);
  	    switch (by) {
  	      case 'row': {
  	        for (let i = 0; i < this.rows; i++) {
  	          sum[i] /= this.columns;
  	        }
  	        return sum;
  	      }
  	      case 'column': {
  	        for (let i = 0; i < this.columns; i++) {
  	          sum[i] /= this.rows;
  	        }
  	        return sum;
  	      }
  	      case undefined:
  	        return sum / this.size;
  	      default:
  	        throw new Error(`invalid option: ${by}`);
  	    }
  	  }

  	  variance(by, options = {}) {
  	    if (typeof by === 'object') {
  	      options = by;
  	      by = undefined;
  	    }
  	    if (typeof options !== 'object') {
  	      throw new TypeError('options must be an object');
  	    }
  	    const { unbiased = true, mean = this.mean(by) } = options;
  	    if (typeof unbiased !== 'boolean') {
  	      throw new TypeError('unbiased must be a boolean');
  	    }
  	    switch (by) {
  	      case 'row': {
  	        if (!isAnyArray.isAnyArray(mean)) {
  	          throw new TypeError('mean must be an array');
  	        }
  	        return varianceByRow(this, unbiased, mean);
  	      }
  	      case 'column': {
  	        if (!isAnyArray.isAnyArray(mean)) {
  	          throw new TypeError('mean must be an array');
  	        }
  	        return varianceByColumn(this, unbiased, mean);
  	      }
  	      case undefined: {
  	        if (typeof mean !== 'number') {
  	          throw new TypeError('mean must be a number');
  	        }
  	        return varianceAll(this, unbiased, mean);
  	      }
  	      default:
  	        throw new Error(`invalid option: ${by}`);
  	    }
  	  }

  	  standardDeviation(by, options) {
  	    if (typeof by === 'object') {
  	      options = by;
  	      by = undefined;
  	    }
  	    const variance = this.variance(by, options);
  	    if (by === undefined) {
  	      return Math.sqrt(variance);
  	    } else {
  	      for (let i = 0; i < variance.length; i++) {
  	        variance[i] = Math.sqrt(variance[i]);
  	      }
  	      return variance;
  	    }
  	  }

  	  center(by, options = {}) {
  	    if (typeof by === 'object') {
  	      options = by;
  	      by = undefined;
  	    }
  	    if (typeof options !== 'object') {
  	      throw new TypeError('options must be an object');
  	    }
  	    const { center = this.mean(by) } = options;
  	    switch (by) {
  	      case 'row': {
  	        if (!isAnyArray.isAnyArray(center)) {
  	          throw new TypeError('center must be an array');
  	        }
  	        centerByRow(this, center);
  	        return this;
  	      }
  	      case 'column': {
  	        if (!isAnyArray.isAnyArray(center)) {
  	          throw new TypeError('center must be an array');
  	        }
  	        centerByColumn(this, center);
  	        return this;
  	      }
  	      case undefined: {
  	        if (typeof center !== 'number') {
  	          throw new TypeError('center must be a number');
  	        }
  	        centerAll(this, center);
  	        return this;
  	      }
  	      default:
  	        throw new Error(`invalid option: ${by}`);
  	    }
  	  }

  	  scale(by, options = {}) {
  	    if (typeof by === 'object') {
  	      options = by;
  	      by = undefined;
  	    }
  	    if (typeof options !== 'object') {
  	      throw new TypeError('options must be an object');
  	    }
  	    let scale = options.scale;
  	    switch (by) {
  	      case 'row': {
  	        if (scale === undefined) {
  	          scale = getScaleByRow(this);
  	        } else if (!isAnyArray.isAnyArray(scale)) {
  	          throw new TypeError('scale must be an array');
  	        }
  	        scaleByRow(this, scale);
  	        return this;
  	      }
  	      case 'column': {
  	        if (scale === undefined) {
  	          scale = getScaleByColumn(this);
  	        } else if (!isAnyArray.isAnyArray(scale)) {
  	          throw new TypeError('scale must be an array');
  	        }
  	        scaleByColumn(this, scale);
  	        return this;
  	      }
  	      case undefined: {
  	        if (scale === undefined) {
  	          scale = getScaleAll(this);
  	        } else if (typeof scale !== 'number') {
  	          throw new TypeError('scale must be a number');
  	        }
  	        scaleAll(this, scale);
  	        return this;
  	      }
  	      default:
  	        throw new Error(`invalid option: ${by}`);
  	    }
  	  }

  	  toString(options) {
  	    return inspectMatrixWithOptions(this, options);
  	  }

  	  [Symbol.iterator]() {
  	    return this.entries();
  	  }

  	  /**
  	   * iterator from left to right, from top to bottom
  	   * yield [row, column, value]
  	   * @returns {Generator<[number, number, number], void, void>}
  	   */
  	  *entries() {
  	    for (let row = 0; row < this.rows; row++) {
  	      for (let col = 0; col < this.columns; col++) {
  	        yield [row, col, this.get(row, col)];
  	      }
  	    }
  	  }

  	  /**
  	   * iterator from left to right, from top to bottom
  	   * yield value
  	   * @returns {Generator<number, void, void>}
  	   */
  	  *values() {
  	    for (let row = 0; row < this.rows; row++) {
  	      for (let col = 0; col < this.columns; col++) {
  	        yield this.get(row, col);
  	      }
  	    }
  	  }
  	}

  	AbstractMatrix.prototype.klass = 'Matrix';
  	if (typeof Symbol !== 'undefined') {
  	  AbstractMatrix.prototype[Symbol.for('nodejs.util.inspect.custom')] =
  	    inspectMatrix;
  	}

  	function compareNumbers(a, b) {
  	  return a - b;
  	}

  	function isArrayOfNumbers(array) {
  	  return array.every((element) => {
  	    return typeof element === 'number';
  	  });
  	}

  	// Synonyms
  	AbstractMatrix.random = AbstractMatrix.rand;
  	AbstractMatrix.randomInt = AbstractMatrix.randInt;
  	AbstractMatrix.diagonal = AbstractMatrix.diag;
  	AbstractMatrix.prototype.diagonal = AbstractMatrix.prototype.diag;
  	AbstractMatrix.identity = AbstractMatrix.eye;
  	AbstractMatrix.prototype.negate = AbstractMatrix.prototype.neg;
  	AbstractMatrix.prototype.tensorProduct =
  	  AbstractMatrix.prototype.kroneckerProduct;

  	class Matrix extends AbstractMatrix {
  	  /**
  	   * @type {Float64Array[]}
  	   */
  	  data;

  	  /**
  	   * Init an empty matrix
  	   * @param {number} nRows
  	   * @param {number} nColumns
  	   */
  	  #initData(nRows, nColumns) {
  	    this.data = [];

  	    if (Number.isInteger(nColumns) && nColumns >= 0) {
  	      for (let i = 0; i < nRows; i++) {
  	        this.data.push(new Float64Array(nColumns));
  	      }
  	    } else {
  	      throw new TypeError('nColumns must be a positive integer');
  	    }

  	    this.rows = nRows;
  	    this.columns = nColumns;
  	  }

  	  constructor(nRows, nColumns) {
  	    super();
  	    if (Matrix.isMatrix(nRows)) {
  	      this.#initData(nRows.rows, nRows.columns);
  	      Matrix.copy(nRows, this);
  	    } else if (Number.isInteger(nRows) && nRows >= 0) {
  	      this.#initData(nRows, nColumns);
  	    } else if (isAnyArray.isAnyArray(nRows)) {
  	      // Copy the values from the 2D array
  	      const arrayData = nRows;
  	      nRows = arrayData.length;
  	      nColumns = nRows ? arrayData[0].length : 0;
  	      if (typeof nColumns !== 'number') {
  	        throw new TypeError(
  	          'Data must be a 2D array with at least one element',
  	        );
  	      }
  	      this.data = [];

  	      for (let i = 0; i < nRows; i++) {
  	        if (arrayData[i].length !== nColumns) {
  	          throw new RangeError('Inconsistent array dimensions');
  	        }
  	        if (!isArrayOfNumbers(arrayData[i])) {
  	          throw new TypeError('Input data contains non-numeric values');
  	        }
  	        this.data.push(Float64Array.from(arrayData[i]));
  	      }

  	      this.rows = nRows;
  	      this.columns = nColumns;
  	    } else {
  	      throw new TypeError(
  	        'First argument must be a positive number or an array',
  	      );
  	    }
  	  }

  	  set(rowIndex, columnIndex, value) {
  	    this.data[rowIndex][columnIndex] = value;
  	    return this;
  	  }

  	  get(rowIndex, columnIndex) {
  	    return this.data[rowIndex][columnIndex];
  	  }

  	  removeRow(index) {
  	    checkRowIndex(this, index);
  	    this.data.splice(index, 1);
  	    this.rows -= 1;
  	    return this;
  	  }

  	  addRow(index, array) {
  	    if (array === undefined) {
  	      array = index;
  	      index = this.rows;
  	    }
  	    checkRowIndex(this, index, true);
  	    array = Float64Array.from(checkRowVector(this, array));
  	    this.data.splice(index, 0, array);
  	    this.rows += 1;
  	    return this;
  	  }

  	  removeColumn(index) {
  	    checkColumnIndex(this, index);
  	    for (let i = 0; i < this.rows; i++) {
  	      const newRow = new Float64Array(this.columns - 1);
  	      for (let j = 0; j < index; j++) {
  	        newRow[j] = this.data[i][j];
  	      }
  	      for (let j = index + 1; j < this.columns; j++) {
  	        newRow[j - 1] = this.data[i][j];
  	      }
  	      this.data[i] = newRow;
  	    }
  	    this.columns -= 1;
  	    return this;
  	  }

  	  addColumn(index, array) {
  	    if (typeof array === 'undefined') {
  	      array = index;
  	      index = this.columns;
  	    }
  	    checkColumnIndex(this, index, true);
  	    array = checkColumnVector(this, array);
  	    for (let i = 0; i < this.rows; i++) {
  	      const newRow = new Float64Array(this.columns + 1);
  	      let j = 0;
  	      for (; j < index; j++) {
  	        newRow[j] = this.data[i][j];
  	      }
  	      newRow[j++] = array[i];
  	      for (; j < this.columns + 1; j++) {
  	        newRow[j] = this.data[i][j - 1];
  	      }
  	      this.data[i] = newRow;
  	    }
  	    this.columns += 1;
  	    return this;
  	  }
  	}

  	installMathOperations(AbstractMatrix, Matrix);

  	/**
  	 * @typedef {0 | 1 | number | boolean} Mask
  	 */

  	class SymmetricMatrix extends AbstractMatrix {
  	  /** @type {Matrix} */
  	  #matrix;

  	  get size() {
  	    return this.#matrix.size;
  	  }

  	  get rows() {
  	    return this.#matrix.rows;
  	  }

  	  get columns() {
  	    return this.#matrix.columns;
  	  }

  	  get diagonalSize() {
  	    return this.rows;
  	  }

  	  /**
  	   * not the same as matrix.isSymmetric()
  	   * Here is to check if it's instanceof SymmetricMatrix without bundling issues
  	   *
  	   * @param value
  	   * @returns {boolean}
  	   */
  	  static isSymmetricMatrix(value) {
  	    return Matrix.isMatrix(value) && value.klassType === 'SymmetricMatrix';
  	  }

  	  /**
  	   * @param diagonalSize
  	   * @return {SymmetricMatrix}
  	   */
  	  static zeros(diagonalSize) {
  	    return new this(diagonalSize);
  	  }

  	  /**
  	   * @param diagonalSize
  	   * @return {SymmetricMatrix}
  	   */
  	  static ones(diagonalSize) {
  	    return new this(diagonalSize).fill(1);
  	  }

  	  /**
  	   * @param {number | AbstractMatrix | ArrayLike<ArrayLike<number>>} diagonalSize
  	   * @return {this}
  	   */
  	  constructor(diagonalSize) {
  	    super();

  	    if (Matrix.isMatrix(diagonalSize)) {
  	      if (!diagonalSize.isSymmetric()) {
  	        throw new TypeError('not symmetric data');
  	      }

  	      this.#matrix = Matrix.copy(
  	        diagonalSize,
  	        new Matrix(diagonalSize.rows, diagonalSize.rows),
  	      );
  	    } else if (Number.isInteger(diagonalSize) && diagonalSize >= 0) {
  	      this.#matrix = new Matrix(diagonalSize, diagonalSize);
  	    } else {
  	      this.#matrix = new Matrix(diagonalSize);

  	      if (!this.isSymmetric()) {
  	        throw new TypeError('not symmetric data');
  	      }
  	    }
  	  }

  	  clone() {
  	    const matrix = new SymmetricMatrix(this.diagonalSize);

  	    for (const [row, col, value] of this.upperRightEntries()) {
  	      matrix.set(row, col, value);
  	    }

  	    return matrix;
  	  }

  	  toMatrix() {
  	    return new Matrix(this);
  	  }

  	  get(rowIndex, columnIndex) {
  	    return this.#matrix.get(rowIndex, columnIndex);
  	  }
  	  set(rowIndex, columnIndex, value) {
  	    // symmetric set
  	    this.#matrix.set(rowIndex, columnIndex, value);
  	    this.#matrix.set(columnIndex, rowIndex, value);

  	    return this;
  	  }

  	  removeCross(index) {
  	    // symmetric remove side
  	    this.#matrix.removeRow(index);
  	    this.#matrix.removeColumn(index);

  	    return this;
  	  }

  	  addCross(index, array) {
  	    if (array === undefined) {
  	      array = index;
  	      index = this.diagonalSize;
  	    }

  	    const row = array.slice();
  	    row.splice(index, 1);

  	    this.#matrix.addRow(index, row);
  	    this.#matrix.addColumn(index, array);

  	    return this;
  	  }

  	  /**
  	   * @param {Mask[]} mask
  	   */
  	  applyMask(mask) {
  	    if (mask.length !== this.diagonalSize) {
  	      throw new RangeError('Mask size do not match with matrix size');
  	    }

  	    // prepare sides to remove from matrix from mask
  	    /** @type {number[]} */
  	    const sidesToRemove = [];
  	    for (const [index, passthroughs] of mask.entries()) {
  	      if (passthroughs) continue;
  	      sidesToRemove.push(index);
  	    }
  	    // to remove from highest to lowest for no mutation shifting
  	    sidesToRemove.reverse();

  	    // remove sides
  	    for (const sideIndex of sidesToRemove) {
  	      this.removeCross(sideIndex);
  	    }

  	    return this;
  	  }

  	  /**
  	   * Compact format upper-right corner of matrix
  	   * iterate from left to right, from top to bottom.
  	   *
  	   * ```
  	   *   A B C D
  	   * A 1 2 3 4
  	   * B 2 5 6 7
  	   * C 3 6 8 9
  	   * D 4 7 9 10
  	   * ```
  	   *
  	   * will return compact 1D array `[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`
  	   *
  	   * length is S(i=0, n=sideSize) => 10 for a 4 sideSized matrix
  	   *
  	   * @returns {number[]}
  	   */
  	  toCompact() {
  	    const { diagonalSize } = this;

  	    /** @type {number[]} */
  	    const compact = new Array((diagonalSize * (diagonalSize + 1)) / 2);
  	    for (let col = 0, row = 0, index = 0; index < compact.length; index++) {
  	      compact[index] = this.get(row, col);

  	      if (++col >= diagonalSize) col = ++row;
  	    }

  	    return compact;
  	  }

  	  /**
  	   * @param {number[]} compact
  	   * @return {SymmetricMatrix}
  	   */
  	  static fromCompact(compact) {
  	    const compactSize = compact.length;
  	    // compactSize = (sideSize * (sideSize + 1)) / 2
  	    // https://mathsolver.microsoft.com/fr/solve-problem/y%20%3D%20%20x%20%60cdot%20%20%20%60frac%7B%20%20%60left(%20x%2B1%20%20%60right)%20%20%20%20%7D%7B%202%20%20%7D
  	    // sideSize = (Sqrt(8 × compactSize + 1) - 1) / 2
  	    const diagonalSize = (Math.sqrt(8 * compactSize + 1) - 1) / 2;

  	    if (!Number.isInteger(diagonalSize)) {
  	      throw new TypeError(
  	        `This array is not a compact representation of a Symmetric Matrix, ${JSON.stringify(
	          compact,
	        )}`,
  	      );
  	    }

  	    const matrix = new SymmetricMatrix(diagonalSize);
  	    for (let col = 0, row = 0, index = 0; index < compactSize; index++) {
  	      matrix.set(col, row, compact[index]);
  	      if (++col >= diagonalSize) col = ++row;
  	    }

  	    return matrix;
  	  }

  	  /**
  	   * half iterator upper-right-corner from left to right, from top to bottom
  	   * yield [row, column, value]
  	   *
  	   * @returns {Generator<[number, number, number], void, void>}
  	   */
  	  *upperRightEntries() {
  	    for (let row = 0, col = 0; row < this.diagonalSize; void 0) {
  	      const value = this.get(row, col);

  	      yield [row, col, value];

  	      // at the end of row, move cursor to next row at diagonal position
  	      if (++col >= this.diagonalSize) col = ++row;
  	    }
  	  }

  	  /**
  	   * half iterator upper-right-corner from left to right, from top to bottom
  	   * yield value
  	   *
  	   * @returns {Generator<[number, number, number], void, void>}
  	   */
  	  *upperRightValues() {
  	    for (let row = 0, col = 0; row < this.diagonalSize; void 0) {
  	      const value = this.get(row, col);

  	      yield value;

  	      // at the end of row, move cursor to next row at diagonal position
  	      if (++col >= this.diagonalSize) col = ++row;
  	    }
  	  }
  	}
  	SymmetricMatrix.prototype.klassType = 'SymmetricMatrix';

  	class DistanceMatrix extends SymmetricMatrix {
  	  /**
  	   * not the same as matrix.isSymmetric()
  	   * Here is to check if it's instanceof SymmetricMatrix without bundling issues
  	   *
  	   * @param value
  	   * @returns {boolean}
  	   */
  	  static isDistanceMatrix(value) {
  	    return (
  	      SymmetricMatrix.isSymmetricMatrix(value) &&
  	      value.klassSubType === 'DistanceMatrix'
  	    );
  	  }

  	  constructor(sideSize) {
  	    super(sideSize);

  	    if (!this.isDistance()) {
  	      throw new TypeError('Provided arguments do no produce a distance matrix');
  	    }
  	  }

  	  set(rowIndex, columnIndex, value) {
  	    // distance matrix diagonal is 0
  	    if (rowIndex === columnIndex) value = 0;

  	    return super.set(rowIndex, columnIndex, value);
  	  }

  	  addCross(index, array) {
  	    if (array === undefined) {
  	      array = index;
  	      index = this.diagonalSize;
  	    }

  	    // ensure distance
  	    array = array.slice();
  	    array[index] = 0;

  	    return super.addCross(index, array);
  	  }

  	  toSymmetricMatrix() {
  	    return new SymmetricMatrix(this);
  	  }

  	  clone() {
  	    const matrix = new DistanceMatrix(this.diagonalSize);

  	    for (const [row, col, value] of this.upperRightEntries()) {
  	      if (row === col) continue;
  	      matrix.set(row, col, value);
  	    }

  	    return matrix;
  	  }

  	  /**
  	   * Compact format upper-right corner of matrix
  	   * no diagonal (only zeros)
  	   * iterable from left to right, from top to bottom.
  	   *
  	   * ```
  	   *   A B C D
  	   * A 0 1 2 3
  	   * B 1 0 4 5
  	   * C 2 4 0 6
  	   * D 3 5 6 0
  	   * ```
  	   *
  	   * will return compact 1D array `[1, 2, 3, 4, 5, 6]`
  	   *
  	   * length is S(i=0, n=sideSize-1) => 6 for a 4 side sized matrix
  	   *
  	   * @returns {number[]}
  	   */
  	  toCompact() {
  	    const { diagonalSize } = this;
  	    const compactLength = ((diagonalSize - 1) * diagonalSize) / 2;

  	    /** @type {number[]} */
  	    const compact = new Array(compactLength);
  	    for (let col = 1, row = 0, index = 0; index < compact.length; index++) {
  	      compact[index] = this.get(row, col);

  	      if (++col >= diagonalSize) col = ++row + 1;
  	    }

  	    return compact;
  	  }

  	  /**
  	   * @param {number[]} compact
  	   */
  	  static fromCompact(compact) {
  	    const compactSize = compact.length;

  	    if (compactSize === 0) {
  	      return new this(0);
  	    }

  	    // compactSize in Natural integer range ]0;∞]
  	    // compactSize = (sideSize * (sideSize - 1)) / 2
  	    // sideSize = (Sqrt(8 × compactSize + 1) + 1) / 2
  	    const diagonalSize = (Math.sqrt(8 * compactSize + 1) + 1) / 2;

  	    if (!Number.isInteger(diagonalSize)) {
  	      throw new TypeError(
  	        `This array is not a compact representation of a DistanceMatrix, ${JSON.stringify(
	          compact,
	        )}`,
  	      );
  	    }

  	    const matrix = new this(diagonalSize);
  	    for (let col = 1, row = 0, index = 0; index < compactSize; index++) {
  	      matrix.set(col, row, compact[index]);
  	      if (++col >= diagonalSize) col = ++row + 1;
  	    }

  	    return matrix;
  	  }
  	}
  	DistanceMatrix.prototype.klassSubType = 'DistanceMatrix';

  	class BaseView extends AbstractMatrix {
  	  constructor(matrix, rows, columns) {
  	    super();
  	    this.matrix = matrix;
  	    this.rows = rows;
  	    this.columns = columns;
  	  }
  	}

  	class MatrixColumnView extends BaseView {
  	  constructor(matrix, column) {
  	    checkColumnIndex(matrix, column);
  	    super(matrix, matrix.rows, 1);
  	    this.column = column;
  	  }

  	  set(rowIndex, columnIndex, value) {
  	    this.matrix.set(rowIndex, this.column, value);
  	    return this;
  	  }

  	  get(rowIndex) {
  	    return this.matrix.get(rowIndex, this.column);
  	  }
  	}

  	class MatrixColumnSelectionView extends BaseView {
  	  constructor(matrix, columnIndices) {
  	    checkColumnIndices(matrix, columnIndices);
  	    super(matrix, matrix.rows, columnIndices.length);
  	    this.columnIndices = columnIndices;
  	  }

  	  set(rowIndex, columnIndex, value) {
  	    this.matrix.set(rowIndex, this.columnIndices[columnIndex], value);
  	    return this;
  	  }

  	  get(rowIndex, columnIndex) {
  	    return this.matrix.get(rowIndex, this.columnIndices[columnIndex]);
  	  }
  	}

  	class MatrixFlipColumnView extends BaseView {
  	  constructor(matrix) {
  	    super(matrix, matrix.rows, matrix.columns);
  	  }

  	  set(rowIndex, columnIndex, value) {
  	    this.matrix.set(rowIndex, this.columns - columnIndex - 1, value);
  	    return this;
  	  }

  	  get(rowIndex, columnIndex) {
  	    return this.matrix.get(rowIndex, this.columns - columnIndex - 1);
  	  }
  	}

  	class MatrixFlipRowView extends BaseView {
  	  constructor(matrix) {
  	    super(matrix, matrix.rows, matrix.columns);
  	  }

  	  set(rowIndex, columnIndex, value) {
  	    this.matrix.set(this.rows - rowIndex - 1, columnIndex, value);
  	    return this;
  	  }

  	  get(rowIndex, columnIndex) {
  	    return this.matrix.get(this.rows - rowIndex - 1, columnIndex);
  	  }
  	}

  	class MatrixRowView extends BaseView {
  	  constructor(matrix, row) {
  	    checkRowIndex(matrix, row);
  	    super(matrix, 1, matrix.columns);
  	    this.row = row;
  	  }

  	  set(rowIndex, columnIndex, value) {
  	    this.matrix.set(this.row, columnIndex, value);
  	    return this;
  	  }

  	  get(rowIndex, columnIndex) {
  	    return this.matrix.get(this.row, columnIndex);
  	  }
  	}

  	class MatrixRowSelectionView extends BaseView {
  	  constructor(matrix, rowIndices) {
  	    checkRowIndices(matrix, rowIndices);
  	    super(matrix, rowIndices.length, matrix.columns);
  	    this.rowIndices = rowIndices;
  	  }

  	  set(rowIndex, columnIndex, value) {
  	    this.matrix.set(this.rowIndices[rowIndex], columnIndex, value);
  	    return this;
  	  }

  	  get(rowIndex, columnIndex) {
  	    return this.matrix.get(this.rowIndices[rowIndex], columnIndex);
  	  }
  	}

  	class MatrixSelectionView extends BaseView {
  	  constructor(matrix, rowIndices, columnIndices) {
  	    checkRowIndices(matrix, rowIndices);
  	    checkColumnIndices(matrix, columnIndices);
  	    super(matrix, rowIndices.length, columnIndices.length);
  	    this.rowIndices = rowIndices;
  	    this.columnIndices = columnIndices;
  	  }

  	  set(rowIndex, columnIndex, value) {
  	    this.matrix.set(
  	      this.rowIndices[rowIndex],
  	      this.columnIndices[columnIndex],
  	      value,
  	    );
  	    return this;
  	  }

  	  get(rowIndex, columnIndex) {
  	    return this.matrix.get(
  	      this.rowIndices[rowIndex],
  	      this.columnIndices[columnIndex],
  	    );
  	  }
  	}

  	class MatrixSubView extends BaseView {
  	  constructor(matrix, startRow, endRow, startColumn, endColumn) {
  	    checkRange(matrix, startRow, endRow, startColumn, endColumn);
  	    super(matrix, endRow - startRow + 1, endColumn - startColumn + 1);
  	    this.startRow = startRow;
  	    this.startColumn = startColumn;
  	  }

  	  set(rowIndex, columnIndex, value) {
  	    this.matrix.set(
  	      this.startRow + rowIndex,
  	      this.startColumn + columnIndex,
  	      value,
  	    );
  	    return this;
  	  }

  	  get(rowIndex, columnIndex) {
  	    return this.matrix.get(
  	      this.startRow + rowIndex,
  	      this.startColumn + columnIndex,
  	    );
  	  }
  	}

  	class MatrixTransposeView extends BaseView {
  	  constructor(matrix) {
  	    super(matrix, matrix.columns, matrix.rows);
  	  }

  	  set(rowIndex, columnIndex, value) {
  	    this.matrix.set(columnIndex, rowIndex, value);
  	    return this;
  	  }

  	  get(rowIndex, columnIndex) {
  	    return this.matrix.get(columnIndex, rowIndex);
  	  }
  	}

  	class WrapperMatrix1D extends AbstractMatrix {
  	  constructor(data, options = {}) {
  	    const { rows = 1 } = options;

  	    if (data.length % rows !== 0) {
  	      throw new Error('the data length is not divisible by the number of rows');
  	    }
  	    super();
  	    this.rows = rows;
  	    this.columns = data.length / rows;
  	    this.data = data;
  	  }

  	  set(rowIndex, columnIndex, value) {
  	    let index = this._calculateIndex(rowIndex, columnIndex);
  	    this.data[index] = value;
  	    return this;
  	  }

  	  get(rowIndex, columnIndex) {
  	    let index = this._calculateIndex(rowIndex, columnIndex);
  	    return this.data[index];
  	  }

  	  _calculateIndex(row, column) {
  	    return row * this.columns + column;
  	  }
  	}

  	class WrapperMatrix2D extends AbstractMatrix {
  	  constructor(data) {
  	    super();
  	    this.data = data;
  	    this.rows = data.length;
  	    this.columns = data[0].length;
  	  }

  	  set(rowIndex, columnIndex, value) {
  	    this.data[rowIndex][columnIndex] = value;
  	    return this;
  	  }

  	  get(rowIndex, columnIndex) {
  	    return this.data[rowIndex][columnIndex];
  	  }
  	}

  	function wrap(array, options) {
  	  if (isAnyArray.isAnyArray(array)) {
  	    if (array[0] && isAnyArray.isAnyArray(array[0])) {
  	      return new WrapperMatrix2D(array);
  	    } else {
  	      return new WrapperMatrix1D(array, options);
  	    }
  	  } else {
  	    throw new Error('the argument is not an array');
  	  }
  	}

  	class LuDecomposition {
  	  constructor(matrix) {
  	    matrix = WrapperMatrix2D.checkMatrix(matrix);

  	    let lu = matrix.clone();
  	    let rows = lu.rows;
  	    let columns = lu.columns;
  	    let pivotVector = new Float64Array(rows);
  	    let pivotSign = 1;
  	    let i, j, k, p, s, t, v;
  	    let LUcolj, kmax;

  	    for (i = 0; i < rows; i++) {
  	      pivotVector[i] = i;
  	    }

  	    LUcolj = new Float64Array(rows);

  	    for (j = 0; j < columns; j++) {
  	      for (i = 0; i < rows; i++) {
  	        LUcolj[i] = lu.get(i, j);
  	      }

  	      for (i = 0; i < rows; i++) {
  	        kmax = Math.min(i, j);
  	        s = 0;
  	        for (k = 0; k < kmax; k++) {
  	          s += lu.get(i, k) * LUcolj[k];
  	        }
  	        LUcolj[i] -= s;
  	        lu.set(i, j, LUcolj[i]);
  	      }

  	      p = j;
  	      for (i = j + 1; i < rows; i++) {
  	        if (Math.abs(LUcolj[i]) > Math.abs(LUcolj[p])) {
  	          p = i;
  	        }
  	      }

  	      if (p !== j) {
  	        for (k = 0; k < columns; k++) {
  	          t = lu.get(p, k);
  	          lu.set(p, k, lu.get(j, k));
  	          lu.set(j, k, t);
  	        }

  	        v = pivotVector[p];
  	        pivotVector[p] = pivotVector[j];
  	        pivotVector[j] = v;

  	        pivotSign = -pivotSign;
  	      }

  	      if (j < rows && lu.get(j, j) !== 0) {
  	        for (i = j + 1; i < rows; i++) {
  	          lu.set(i, j, lu.get(i, j) / lu.get(j, j));
  	        }
  	      }
  	    }

  	    this.LU = lu;
  	    this.pivotVector = pivotVector;
  	    this.pivotSign = pivotSign;
  	  }

  	  isSingular() {
  	    let data = this.LU;
  	    let col = data.columns;
  	    for (let j = 0; j < col; j++) {
  	      if (data.get(j, j) === 0) {
  	        return true;
  	      }
  	    }
  	    return false;
  	  }

  	  solve(value) {
  	    value = Matrix.checkMatrix(value);

  	    let lu = this.LU;
  	    let rows = lu.rows;

  	    if (rows !== value.rows) {
  	      throw new Error('Invalid matrix dimensions');
  	    }
  	    if (this.isSingular()) {
  	      throw new Error('LU matrix is singular');
  	    }

  	    let count = value.columns;
  	    let X = value.subMatrixRow(this.pivotVector, 0, count - 1);
  	    let columns = lu.columns;
  	    let i, j, k;

  	    for (k = 0; k < columns; k++) {
  	      for (i = k + 1; i < columns; i++) {
  	        for (j = 0; j < count; j++) {
  	          X.set(i, j, X.get(i, j) - X.get(k, j) * lu.get(i, k));
  	        }
  	      }
  	    }
  	    for (k = columns - 1; k >= 0; k--) {
  	      for (j = 0; j < count; j++) {
  	        X.set(k, j, X.get(k, j) / lu.get(k, k));
  	      }
  	      for (i = 0; i < k; i++) {
  	        for (j = 0; j < count; j++) {
  	          X.set(i, j, X.get(i, j) - X.get(k, j) * lu.get(i, k));
  	        }
  	      }
  	    }
  	    return X;
  	  }

  	  get determinant() {
  	    let data = this.LU;
  	    if (!data.isSquare()) {
  	      throw new Error('Matrix must be square');
  	    }
  	    let determinant = this.pivotSign;
  	    let col = data.columns;
  	    for (let j = 0; j < col; j++) {
  	      determinant *= data.get(j, j);
  	    }
  	    return determinant;
  	  }

  	  get lowerTriangularMatrix() {
  	    let data = this.LU;
  	    let rows = data.rows;
  	    let columns = data.columns;
  	    let X = new Matrix(rows, columns);
  	    for (let i = 0; i < rows; i++) {
  	      for (let j = 0; j < columns; j++) {
  	        if (i > j) {
  	          X.set(i, j, data.get(i, j));
  	        } else if (i === j) {
  	          X.set(i, j, 1);
  	        } else {
  	          X.set(i, j, 0);
  	        }
  	      }
  	    }
  	    return X;
  	  }

  	  get upperTriangularMatrix() {
  	    let data = this.LU;
  	    let rows = data.rows;
  	    let columns = data.columns;
  	    let X = new Matrix(rows, columns);
  	    for (let i = 0; i < rows; i++) {
  	      for (let j = 0; j < columns; j++) {
  	        if (i <= j) {
  	          X.set(i, j, data.get(i, j));
  	        } else {
  	          X.set(i, j, 0);
  	        }
  	      }
  	    }
  	    return X;
  	  }

  	  get pivotPermutationVector() {
  	    return Array.from(this.pivotVector);
  	  }
  	}

  	function hypotenuse(a, b) {
  	  let r = 0;
  	  if (Math.abs(a) > Math.abs(b)) {
  	    r = b / a;
  	    return Math.abs(a) * Math.sqrt(1 + r * r);
  	  }
  	  if (b !== 0) {
  	    r = a / b;
  	    return Math.abs(b) * Math.sqrt(1 + r * r);
  	  }
  	  return 0;
  	}

  	class QrDecomposition {
  	  constructor(value) {
  	    value = WrapperMatrix2D.checkMatrix(value);

  	    let qr = value.clone();
  	    let m = value.rows;
  	    let n = value.columns;
  	    let rdiag = new Float64Array(n);
  	    let i, j, k, s;

  	    for (k = 0; k < n; k++) {
  	      let nrm = 0;
  	      for (i = k; i < m; i++) {
  	        nrm = hypotenuse(nrm, qr.get(i, k));
  	      }
  	      if (nrm !== 0) {
  	        if (qr.get(k, k) < 0) {
  	          nrm = -nrm;
  	        }
  	        for (i = k; i < m; i++) {
  	          qr.set(i, k, qr.get(i, k) / nrm);
  	        }
  	        qr.set(k, k, qr.get(k, k) + 1);
  	        for (j = k + 1; j < n; j++) {
  	          s = 0;
  	          for (i = k; i < m; i++) {
  	            s += qr.get(i, k) * qr.get(i, j);
  	          }
  	          s = -s / qr.get(k, k);
  	          for (i = k; i < m; i++) {
  	            qr.set(i, j, qr.get(i, j) + s * qr.get(i, k));
  	          }
  	        }
  	      }
  	      rdiag[k] = -nrm;
  	    }

  	    this.QR = qr;
  	    this.Rdiag = rdiag;
  	  }

  	  solve(value) {
  	    value = Matrix.checkMatrix(value);

  	    let qr = this.QR;
  	    let m = qr.rows;

  	    if (value.rows !== m) {
  	      throw new Error('Matrix row dimensions must agree');
  	    }
  	    if (!this.isFullRank()) {
  	      throw new Error('Matrix is rank deficient');
  	    }

  	    let count = value.columns;
  	    let X = value.clone();
  	    let n = qr.columns;
  	    let i, j, k, s;

  	    for (k = 0; k < n; k++) {
  	      for (j = 0; j < count; j++) {
  	        s = 0;
  	        for (i = k; i < m; i++) {
  	          s += qr.get(i, k) * X.get(i, j);
  	        }
  	        s = -s / qr.get(k, k);
  	        for (i = k; i < m; i++) {
  	          X.set(i, j, X.get(i, j) + s * qr.get(i, k));
  	        }
  	      }
  	    }
  	    for (k = n - 1; k >= 0; k--) {
  	      for (j = 0; j < count; j++) {
  	        X.set(k, j, X.get(k, j) / this.Rdiag[k]);
  	      }
  	      for (i = 0; i < k; i++) {
  	        for (j = 0; j < count; j++) {
  	          X.set(i, j, X.get(i, j) - X.get(k, j) * qr.get(i, k));
  	        }
  	      }
  	    }

  	    return X.subMatrix(0, n - 1, 0, count - 1);
  	  }

  	  isFullRank() {
  	    let columns = this.QR.columns;
  	    for (let i = 0; i < columns; i++) {
  	      if (this.Rdiag[i] === 0) {
  	        return false;
  	      }
  	    }
  	    return true;
  	  }

  	  get upperTriangularMatrix() {
  	    let qr = this.QR;
  	    let n = qr.columns;
  	    let X = new Matrix(n, n);
  	    let i, j;
  	    for (i = 0; i < n; i++) {
  	      for (j = 0; j < n; j++) {
  	        if (i < j) {
  	          X.set(i, j, qr.get(i, j));
  	        } else if (i === j) {
  	          X.set(i, j, this.Rdiag[i]);
  	        } else {
  	          X.set(i, j, 0);
  	        }
  	      }
  	    }
  	    return X;
  	  }

  	  get orthogonalMatrix() {
  	    let qr = this.QR;
  	    let rows = qr.rows;
  	    let columns = qr.columns;
  	    let X = new Matrix(rows, columns);
  	    let i, j, k, s;

  	    for (k = columns - 1; k >= 0; k--) {
  	      for (i = 0; i < rows; i++) {
  	        X.set(i, k, 0);
  	      }
  	      X.set(k, k, 1);
  	      for (j = k; j < columns; j++) {
  	        if (qr.get(k, k) !== 0) {
  	          s = 0;
  	          for (i = k; i < rows; i++) {
  	            s += qr.get(i, k) * X.get(i, j);
  	          }

  	          s = -s / qr.get(k, k);

  	          for (i = k; i < rows; i++) {
  	            X.set(i, j, X.get(i, j) + s * qr.get(i, k));
  	          }
  	        }
  	      }
  	    }
  	    return X;
  	  }
  	}

  	class SingularValueDecomposition {
  	  constructor(value, options = {}) {
  	    value = WrapperMatrix2D.checkMatrix(value);

  	    if (value.isEmpty()) {
  	      throw new Error('Matrix must be non-empty');
  	    }

  	    let m = value.rows;
  	    let n = value.columns;

  	    const {
  	      computeLeftSingularVectors = true,
  	      computeRightSingularVectors = true,
  	      autoTranspose = false,
  	    } = options;

  	    let wantu = Boolean(computeLeftSingularVectors);
  	    let wantv = Boolean(computeRightSingularVectors);

  	    let swapped = false;
  	    let a;
  	    if (m < n) {
  	      if (!autoTranspose) {
  	        a = value.clone();
  	        // eslint-disable-next-line no-console
  	        console.warn(
  	          'Computing SVD on a matrix with more columns than rows. Consider enabling autoTranspose',
  	        );
  	      } else {
  	        a = value.transpose();
  	        m = a.rows;
  	        n = a.columns;
  	        swapped = true;
  	        let aux = wantu;
  	        wantu = wantv;
  	        wantv = aux;
  	      }
  	    } else {
  	      a = value.clone();
  	    }

  	    let nu = Math.min(m, n);
  	    let ni = Math.min(m + 1, n);
  	    let s = new Float64Array(ni);
  	    let U = new Matrix(m, nu);
  	    let V = new Matrix(n, n);

  	    let e = new Float64Array(n);
  	    let work = new Float64Array(m);

  	    let si = new Float64Array(ni);
  	    for (let i = 0; i < ni; i++) si[i] = i;

  	    let nct = Math.min(m - 1, n);
  	    let nrt = Math.max(0, Math.min(n - 2, m));
  	    let mrc = Math.max(nct, nrt);

  	    for (let k = 0; k < mrc; k++) {
  	      if (k < nct) {
  	        s[k] = 0;
  	        for (let i = k; i < m; i++) {
  	          s[k] = hypotenuse(s[k], a.get(i, k));
  	        }
  	        if (s[k] !== 0) {
  	          if (a.get(k, k) < 0) {
  	            s[k] = -s[k];
  	          }
  	          for (let i = k; i < m; i++) {
  	            a.set(i, k, a.get(i, k) / s[k]);
  	          }
  	          a.set(k, k, a.get(k, k) + 1);
  	        }
  	        s[k] = -s[k];
  	      }

  	      for (let j = k + 1; j < n; j++) {
  	        if (k < nct && s[k] !== 0) {
  	          let t = 0;
  	          for (let i = k; i < m; i++) {
  	            t += a.get(i, k) * a.get(i, j);
  	          }
  	          t = -t / a.get(k, k);
  	          for (let i = k; i < m; i++) {
  	            a.set(i, j, a.get(i, j) + t * a.get(i, k));
  	          }
  	        }
  	        e[j] = a.get(k, j);
  	      }

  	      if (wantu && k < nct) {
  	        for (let i = k; i < m; i++) {
  	          U.set(i, k, a.get(i, k));
  	        }
  	      }

  	      if (k < nrt) {
  	        e[k] = 0;
  	        for (let i = k + 1; i < n; i++) {
  	          e[k] = hypotenuse(e[k], e[i]);
  	        }
  	        if (e[k] !== 0) {
  	          if (e[k + 1] < 0) {
  	            e[k] = 0 - e[k];
  	          }
  	          for (let i = k + 1; i < n; i++) {
  	            e[i] /= e[k];
  	          }
  	          e[k + 1] += 1;
  	        }
  	        e[k] = -e[k];
  	        if (k + 1 < m && e[k] !== 0) {
  	          for (let i = k + 1; i < m; i++) {
  	            work[i] = 0;
  	          }
  	          for (let i = k + 1; i < m; i++) {
  	            for (let j = k + 1; j < n; j++) {
  	              work[i] += e[j] * a.get(i, j);
  	            }
  	          }
  	          for (let j = k + 1; j < n; j++) {
  	            let t = -e[j] / e[k + 1];
  	            for (let i = k + 1; i < m; i++) {
  	              a.set(i, j, a.get(i, j) + t * work[i]);
  	            }
  	          }
  	        }
  	        if (wantv) {
  	          for (let i = k + 1; i < n; i++) {
  	            V.set(i, k, e[i]);
  	          }
  	        }
  	      }
  	    }

  	    let p = Math.min(n, m + 1);
  	    if (nct < n) {
  	      s[nct] = a.get(nct, nct);
  	    }
  	    if (m < p) {
  	      s[p - 1] = 0;
  	    }
  	    if (nrt + 1 < p) {
  	      e[nrt] = a.get(nrt, p - 1);
  	    }
  	    e[p - 1] = 0;

  	    if (wantu) {
  	      for (let j = nct; j < nu; j++) {
  	        for (let i = 0; i < m; i++) {
  	          U.set(i, j, 0);
  	        }
  	        U.set(j, j, 1);
  	      }
  	      for (let k = nct - 1; k >= 0; k--) {
  	        if (s[k] !== 0) {
  	          for (let j = k + 1; j < nu; j++) {
  	            let t = 0;
  	            for (let i = k; i < m; i++) {
  	              t += U.get(i, k) * U.get(i, j);
  	            }
  	            t = -t / U.get(k, k);
  	            for (let i = k; i < m; i++) {
  	              U.set(i, j, U.get(i, j) + t * U.get(i, k));
  	            }
  	          }
  	          for (let i = k; i < m; i++) {
  	            U.set(i, k, -U.get(i, k));
  	          }
  	          U.set(k, k, 1 + U.get(k, k));
  	          for (let i = 0; i < k - 1; i++) {
  	            U.set(i, k, 0);
  	          }
  	        } else {
  	          for (let i = 0; i < m; i++) {
  	            U.set(i, k, 0);
  	          }
  	          U.set(k, k, 1);
  	        }
  	      }
  	    }

  	    if (wantv) {
  	      for (let k = n - 1; k >= 0; k--) {
  	        if (k < nrt && e[k] !== 0) {
  	          for (let j = k + 1; j < n; j++) {
  	            let t = 0;
  	            for (let i = k + 1; i < n; i++) {
  	              t += V.get(i, k) * V.get(i, j);
  	            }
  	            t = -t / V.get(k + 1, k);
  	            for (let i = k + 1; i < n; i++) {
  	              V.set(i, j, V.get(i, j) + t * V.get(i, k));
  	            }
  	          }
  	        }
  	        for (let i = 0; i < n; i++) {
  	          V.set(i, k, 0);
  	        }
  	        V.set(k, k, 1);
  	      }
  	    }

  	    let pp = p - 1;
  	    let eps = Number.EPSILON;
  	    while (p > 0) {
  	      let k, kase;
  	      for (k = p - 2; k >= -1; k--) {
  	        if (k === -1) {
  	          break;
  	        }
  	        const alpha =
  	          Number.MIN_VALUE + eps * Math.abs(s[k] + Math.abs(s[k + 1]));
  	        if (Math.abs(e[k]) <= alpha || Number.isNaN(e[k])) {
  	          e[k] = 0;
  	          break;
  	        }
  	      }
  	      if (k === p - 2) {
  	        kase = 4;
  	      } else {
  	        let ks;
  	        for (ks = p - 1; ks >= k; ks--) {
  	          if (ks === k) {
  	            break;
  	          }
  	          let t =
  	            (ks !== p ? Math.abs(e[ks]) : 0) +
  	            (ks !== k + 1 ? Math.abs(e[ks - 1]) : 0);
  	          if (Math.abs(s[ks]) <= eps * t) {
  	            s[ks] = 0;
  	            break;
  	          }
  	        }
  	        if (ks === k) {
  	          kase = 3;
  	        } else if (ks === p - 1) {
  	          kase = 1;
  	        } else {
  	          kase = 2;
  	          k = ks;
  	        }
  	      }

  	      k++;

  	      switch (kase) {
  	        case 1: {
  	          let f = e[p - 2];
  	          e[p - 2] = 0;
  	          for (let j = p - 2; j >= k; j--) {
  	            let t = hypotenuse(s[j], f);
  	            let cs = s[j] / t;
  	            let sn = f / t;
  	            s[j] = t;
  	            if (j !== k) {
  	              f = -sn * e[j - 1];
  	              e[j - 1] = cs * e[j - 1];
  	            }
  	            if (wantv) {
  	              for (let i = 0; i < n; i++) {
  	                t = cs * V.get(i, j) + sn * V.get(i, p - 1);
  	                V.set(i, p - 1, -sn * V.get(i, j) + cs * V.get(i, p - 1));
  	                V.set(i, j, t);
  	              }
  	            }
  	          }
  	          break;
  	        }
  	        case 2: {
  	          let f = e[k - 1];
  	          e[k - 1] = 0;
  	          for (let j = k; j < p; j++) {
  	            let t = hypotenuse(s[j], f);
  	            let cs = s[j] / t;
  	            let sn = f / t;
  	            s[j] = t;
  	            f = -sn * e[j];
  	            e[j] = cs * e[j];
  	            if (wantu) {
  	              for (let i = 0; i < m; i++) {
  	                t = cs * U.get(i, j) + sn * U.get(i, k - 1);
  	                U.set(i, k - 1, -sn * U.get(i, j) + cs * U.get(i, k - 1));
  	                U.set(i, j, t);
  	              }
  	            }
  	          }
  	          break;
  	        }
  	        case 3: {
  	          const scale = Math.max(
  	            Math.abs(s[p - 1]),
  	            Math.abs(s[p - 2]),
  	            Math.abs(e[p - 2]),
  	            Math.abs(s[k]),
  	            Math.abs(e[k]),
  	          );
  	          const sp = s[p - 1] / scale;
  	          const spm1 = s[p - 2] / scale;
  	          const epm1 = e[p - 2] / scale;
  	          const sk = s[k] / scale;
  	          const ek = e[k] / scale;
  	          const b = ((spm1 + sp) * (spm1 - sp) + epm1 * epm1) / 2;
  	          const c = sp * epm1 * (sp * epm1);
  	          let shift = 0;
  	          if (b !== 0 || c !== 0) {
  	            if (b < 0) {
  	              shift = 0 - Math.sqrt(b * b + c);
  	            } else {
  	              shift = Math.sqrt(b * b + c);
  	            }
  	            shift = c / (b + shift);
  	          }
  	          let f = (sk + sp) * (sk - sp) + shift;
  	          let g = sk * ek;
  	          for (let j = k; j < p - 1; j++) {
  	            let t = hypotenuse(f, g);
  	            if (t === 0) t = Number.MIN_VALUE;
  	            let cs = f / t;
  	            let sn = g / t;
  	            if (j !== k) {
  	              e[j - 1] = t;
  	            }
  	            f = cs * s[j] + sn * e[j];
  	            e[j] = cs * e[j] - sn * s[j];
  	            g = sn * s[j + 1];
  	            s[j + 1] = cs * s[j + 1];
  	            if (wantv) {
  	              for (let i = 0; i < n; i++) {
  	                t = cs * V.get(i, j) + sn * V.get(i, j + 1);
  	                V.set(i, j + 1, -sn * V.get(i, j) + cs * V.get(i, j + 1));
  	                V.set(i, j, t);
  	              }
  	            }
  	            t = hypotenuse(f, g);
  	            if (t === 0) t = Number.MIN_VALUE;
  	            cs = f / t;
  	            sn = g / t;
  	            s[j] = t;
  	            f = cs * e[j] + sn * s[j + 1];
  	            s[j + 1] = -sn * e[j] + cs * s[j + 1];
  	            g = sn * e[j + 1];
  	            e[j + 1] = cs * e[j + 1];
  	            if (wantu && j < m - 1) {
  	              for (let i = 0; i < m; i++) {
  	                t = cs * U.get(i, j) + sn * U.get(i, j + 1);
  	                U.set(i, j + 1, -sn * U.get(i, j) + cs * U.get(i, j + 1));
  	                U.set(i, j, t);
  	              }
  	            }
  	          }
  	          e[p - 2] = f;
  	          break;
  	        }
  	        case 4: {
  	          if (s[k] <= 0) {
  	            s[k] = s[k] < 0 ? -s[k] : 0;
  	            if (wantv) {
  	              for (let i = 0; i <= pp; i++) {
  	                V.set(i, k, -V.get(i, k));
  	              }
  	            }
  	          }
  	          while (k < pp) {
  	            if (s[k] >= s[k + 1]) {
  	              break;
  	            }
  	            let t = s[k];
  	            s[k] = s[k + 1];
  	            s[k + 1] = t;
  	            if (wantv && k < n - 1) {
  	              for (let i = 0; i < n; i++) {
  	                t = V.get(i, k + 1);
  	                V.set(i, k + 1, V.get(i, k));
  	                V.set(i, k, t);
  	              }
  	            }
  	            if (wantu && k < m - 1) {
  	              for (let i = 0; i < m; i++) {
  	                t = U.get(i, k + 1);
  	                U.set(i, k + 1, U.get(i, k));
  	                U.set(i, k, t);
  	              }
  	            }
  	            k++;
  	          }
  	          p--;
  	          break;
  	        }
  	        // no default
  	      }
  	    }

  	    if (swapped) {
  	      let tmp = V;
  	      V = U;
  	      U = tmp;
  	    }

  	    this.m = m;
  	    this.n = n;
  	    this.s = s;
  	    this.U = U;
  	    this.V = V;
  	  }

  	  solve(value) {
  	    let Y = value;
  	    let e = this.threshold;
  	    let scols = this.s.length;
  	    let Ls = Matrix.zeros(scols, scols);

  	    for (let i = 0; i < scols; i++) {
  	      if (Math.abs(this.s[i]) <= e) {
  	        Ls.set(i, i, 0);
  	      } else {
  	        Ls.set(i, i, 1 / this.s[i]);
  	      }
  	    }

  	    let U = this.U;
  	    let V = this.rightSingularVectors;

  	    let VL = V.mmul(Ls);
  	    let vrows = V.rows;
  	    let urows = U.rows;
  	    let VLU = Matrix.zeros(vrows, urows);

  	    for (let i = 0; i < vrows; i++) {
  	      for (let j = 0; j < urows; j++) {
  	        let sum = 0;
  	        for (let k = 0; k < scols; k++) {
  	          sum += VL.get(i, k) * U.get(j, k);
  	        }
  	        VLU.set(i, j, sum);
  	      }
  	    }

  	    return VLU.mmul(Y);
  	  }

  	  solveForDiagonal(value) {
  	    return this.solve(Matrix.diag(value));
  	  }

  	  inverse() {
  	    let V = this.V;
  	    let e = this.threshold;
  	    let vrows = V.rows;
  	    let vcols = V.columns;
  	    let X = new Matrix(vrows, this.s.length);

  	    for (let i = 0; i < vrows; i++) {
  	      for (let j = 0; j < vcols; j++) {
  	        if (Math.abs(this.s[j]) > e) {
  	          X.set(i, j, V.get(i, j) / this.s[j]);
  	        }
  	      }
  	    }

  	    let U = this.U;

  	    let urows = U.rows;
  	    let ucols = U.columns;
  	    let Y = new Matrix(vrows, urows);

  	    for (let i = 0; i < vrows; i++) {
  	      for (let j = 0; j < urows; j++) {
  	        let sum = 0;
  	        for (let k = 0; k < ucols; k++) {
  	          sum += X.get(i, k) * U.get(j, k);
  	        }
  	        Y.set(i, j, sum);
  	      }
  	    }

  	    return Y;
  	  }

  	  get condition() {
  	    return this.s[0] / this.s[Math.min(this.m, this.n) - 1];
  	  }

  	  get norm2() {
  	    return this.s[0];
  	  }

  	  get rank() {
  	    let tol = Math.max(this.m, this.n) * this.s[0] * Number.EPSILON;
  	    let r = 0;
  	    let s = this.s;
  	    for (let i = 0, ii = s.length; i < ii; i++) {
  	      if (s[i] > tol) {
  	        r++;
  	      }
  	    }
  	    return r;
  	  }

  	  get diagonal() {
  	    return Array.from(this.s);
  	  }

  	  get threshold() {
  	    return (Number.EPSILON / 2) * Math.max(this.m, this.n) * this.s[0];
  	  }

  	  get leftSingularVectors() {
  	    return this.U;
  	  }

  	  get rightSingularVectors() {
  	    return this.V;
  	  }

  	  get diagonalMatrix() {
  	    return Matrix.diag(this.s);
  	  }
  	}

  	function inverse(matrix, useSVD = false) {
  	  matrix = WrapperMatrix2D.checkMatrix(matrix);
  	  if (useSVD) {
  	    return new SingularValueDecomposition(matrix).inverse();
  	  } else {
  	    return solve(matrix, Matrix.eye(matrix.rows));
  	  }
  	}

  	function solve(leftHandSide, rightHandSide, useSVD = false) {
  	  leftHandSide = WrapperMatrix2D.checkMatrix(leftHandSide);
  	  rightHandSide = WrapperMatrix2D.checkMatrix(rightHandSide);
  	  if (useSVD) {
  	    return new SingularValueDecomposition(leftHandSide).solve(rightHandSide);
  	  } else {
  	    return leftHandSide.isSquare()
  	      ? new LuDecomposition(leftHandSide).solve(rightHandSide)
  	      : new QrDecomposition(leftHandSide).solve(rightHandSide);
  	  }
  	}

  	function determinant(matrix) {
  	  matrix = Matrix.checkMatrix(matrix);
  	  if (matrix.isSquare()) {
  	    if (matrix.columns === 0) {
  	      return 1;
  	    }

  	    let a, b, c, d;
  	    if (matrix.columns === 2) {
  	      // 2 x 2 matrix
  	      a = matrix.get(0, 0);
  	      b = matrix.get(0, 1);
  	      c = matrix.get(1, 0);
  	      d = matrix.get(1, 1);

  	      return a * d - b * c;
  	    } else if (matrix.columns === 3) {
  	      // 3 x 3 matrix
  	      let subMatrix0, subMatrix1, subMatrix2;
  	      subMatrix0 = new MatrixSelectionView(matrix, [1, 2], [1, 2]);
  	      subMatrix1 = new MatrixSelectionView(matrix, [1, 2], [0, 2]);
  	      subMatrix2 = new MatrixSelectionView(matrix, [1, 2], [0, 1]);
  	      a = matrix.get(0, 0);
  	      b = matrix.get(0, 1);
  	      c = matrix.get(0, 2);

  	      return (
  	        a * determinant(subMatrix0) -
  	        b * determinant(subMatrix1) +
  	        c * determinant(subMatrix2)
  	      );
  	    } else {
  	      // general purpose determinant using the LU decomposition
  	      return new LuDecomposition(matrix).determinant;
  	    }
  	  } else {
  	    throw Error('determinant can only be calculated for a square matrix');
  	  }
  	}

  	function xrange(n, exception) {
  	  let range = [];
  	  for (let i = 0; i < n; i++) {
  	    if (i !== exception) {
  	      range.push(i);
  	    }
  	  }
  	  return range;
  	}

  	function dependenciesOneRow(
  	  error,
  	  matrix,
  	  index,
  	  thresholdValue = 10e-10,
  	  thresholdError = 10e-10,
  	) {
  	  if (error > thresholdError) {
  	    return new Array(matrix.rows + 1).fill(0);
  	  } else {
  	    let returnArray = matrix.addRow(index, [0]);
  	    for (let i = 0; i < returnArray.rows; i++) {
  	      if (Math.abs(returnArray.get(i, 0)) < thresholdValue) {
  	        returnArray.set(i, 0, 0);
  	      }
  	    }
  	    return returnArray.to1DArray();
  	  }
  	}

  	function linearDependencies(matrix, options = {}) {
  	  const { thresholdValue = 10e-10, thresholdError = 10e-10 } = options;
  	  matrix = Matrix.checkMatrix(matrix);

  	  let n = matrix.rows;
  	  let results = new Matrix(n, n);

  	  for (let i = 0; i < n; i++) {
  	    let b = Matrix.columnVector(matrix.getRow(i));
  	    let Abis = matrix.subMatrixRow(xrange(n, i)).transpose();
  	    let svd = new SingularValueDecomposition(Abis);
  	    let x = svd.solve(b);
  	    let error = Matrix.sub(b, Abis.mmul(x)).abs().max();
  	    results.setRow(
  	      i,
  	      dependenciesOneRow(error, x, i, thresholdValue, thresholdError),
  	    );
  	  }
  	  return results;
  	}

  	function pseudoInverse(matrix, threshold = Number.EPSILON) {
  	  matrix = Matrix.checkMatrix(matrix);
  	  if (matrix.isEmpty()) {
  	    // with a zero dimension, the pseudo-inverse is the transpose, since all 0xn and nx0 matrices are singular
  	    // (0xn)*(nx0)*(0xn) = 0xn
  	    // (nx0)*(0xn)*(nx0) = nx0
  	    return matrix.transpose();
  	  }
  	  let svdSolution = new SingularValueDecomposition(matrix, { autoTranspose: true });

  	  let U = svdSolution.leftSingularVectors;
  	  let V = svdSolution.rightSingularVectors;
  	  let s = svdSolution.diagonal;

  	  for (let i = 0; i < s.length; i++) {
  	    if (Math.abs(s[i]) > threshold) {
  	      s[i] = 1.0 / s[i];
  	    } else {
  	      s[i] = 0.0;
  	    }
  	  }

  	  return V.mmul(Matrix.diag(s).mmul(U.transpose()));
  	}

  	function covariance(xMatrix, yMatrix = xMatrix, options = {}) {
  	  xMatrix = new Matrix(xMatrix);
  	  let yIsSame = false;
  	  if (
  	    typeof yMatrix === 'object' &&
  	    !Matrix.isMatrix(yMatrix) &&
  	    !isAnyArray.isAnyArray(yMatrix)
  	  ) {
  	    options = yMatrix;
  	    yMatrix = xMatrix;
  	    yIsSame = true;
  	  } else {
  	    yMatrix = new Matrix(yMatrix);
  	  }
  	  if (xMatrix.rows !== yMatrix.rows) {
  	    throw new TypeError('Both matrices must have the same number of rows');
  	  }
  	  const { center = true } = options;
  	  if (center) {
  	    xMatrix = xMatrix.center('column');
  	    if (!yIsSame) {
  	      yMatrix = yMatrix.center('column');
  	    }
  	  }
  	  const cov = xMatrix.transpose().mmul(yMatrix);
  	  for (let i = 0; i < cov.rows; i++) {
  	    for (let j = 0; j < cov.columns; j++) {
  	      cov.set(i, j, cov.get(i, j) * (1 / (xMatrix.rows - 1)));
  	    }
  	  }
  	  return cov;
  	}

  	function correlation(xMatrix, yMatrix = xMatrix, options = {}) {
  	  xMatrix = new Matrix(xMatrix);
  	  let yIsSame = false;
  	  if (
  	    typeof yMatrix === 'object' &&
  	    !Matrix.isMatrix(yMatrix) &&
  	    !isAnyArray.isAnyArray(yMatrix)
  	  ) {
  	    options = yMatrix;
  	    yMatrix = xMatrix;
  	    yIsSame = true;
  	  } else {
  	    yMatrix = new Matrix(yMatrix);
  	  }
  	  if (xMatrix.rows !== yMatrix.rows) {
  	    throw new TypeError('Both matrices must have the same number of rows');
  	  }

  	  const { center = true, scale = true } = options;
  	  if (center) {
  	    xMatrix.center('column');
  	    if (!yIsSame) {
  	      yMatrix.center('column');
  	    }
  	  }
  	  if (scale) {
  	    xMatrix.scale('column');
  	    if (!yIsSame) {
  	      yMatrix.scale('column');
  	    }
  	  }

  	  const sdx = xMatrix.standardDeviation('column', { unbiased: true });
  	  const sdy = yIsSame
  	    ? sdx
  	    : yMatrix.standardDeviation('column', { unbiased: true });

  	  const corr = xMatrix.transpose().mmul(yMatrix);
  	  for (let i = 0; i < corr.rows; i++) {
  	    for (let j = 0; j < corr.columns; j++) {
  	      corr.set(
  	        i,
  	        j,
  	        corr.get(i, j) * (1 / (sdx[i] * sdy[j])) * (1 / (xMatrix.rows - 1)),
  	      );
  	    }
  	  }
  	  return corr;
  	}

  	class EigenvalueDecomposition {
  	  constructor(matrix, options = {}) {
  	    const { assumeSymmetric = false } = options;

  	    matrix = WrapperMatrix2D.checkMatrix(matrix);
  	    if (!matrix.isSquare()) {
  	      throw new Error('Matrix is not a square matrix');
  	    }

  	    if (matrix.isEmpty()) {
  	      throw new Error('Matrix must be non-empty');
  	    }

  	    let n = matrix.columns;
  	    let V = new Matrix(n, n);
  	    let d = new Float64Array(n);
  	    let e = new Float64Array(n);
  	    let value = matrix;
  	    let i, j;

  	    let isSymmetric = false;
  	    if (assumeSymmetric) {
  	      isSymmetric = true;
  	    } else {
  	      isSymmetric = matrix.isSymmetric();
  	    }

  	    if (isSymmetric) {
  	      for (i = 0; i < n; i++) {
  	        for (j = 0; j < n; j++) {
  	          V.set(i, j, value.get(i, j));
  	        }
  	      }
  	      tred2(n, e, d, V);
  	      tql2(n, e, d, V);
  	    } else {
  	      let H = new Matrix(n, n);
  	      let ort = new Float64Array(n);
  	      for (j = 0; j < n; j++) {
  	        for (i = 0; i < n; i++) {
  	          H.set(i, j, value.get(i, j));
  	        }
  	      }
  	      orthes(n, H, ort, V);
  	      hqr2(n, e, d, V, H);
  	    }

  	    this.n = n;
  	    this.e = e;
  	    this.d = d;
  	    this.V = V;
  	  }

  	  get realEigenvalues() {
  	    return Array.from(this.d);
  	  }

  	  get imaginaryEigenvalues() {
  	    return Array.from(this.e);
  	  }

  	  get eigenvectorMatrix() {
  	    return this.V;
  	  }

  	  get diagonalMatrix() {
  	    let n = this.n;
  	    let e = this.e;
  	    let d = this.d;
  	    let X = new Matrix(n, n);
  	    let i, j;
  	    for (i = 0; i < n; i++) {
  	      for (j = 0; j < n; j++) {
  	        X.set(i, j, 0);
  	      }
  	      X.set(i, i, d[i]);
  	      if (e[i] > 0) {
  	        X.set(i, i + 1, e[i]);
  	      } else if (e[i] < 0) {
  	        X.set(i, i - 1, e[i]);
  	      }
  	    }
  	    return X;
  	  }
  	}

  	function tred2(n, e, d, V) {
  	  let f, g, h, i, j, k, hh, scale;

  	  for (j = 0; j < n; j++) {
  	    d[j] = V.get(n - 1, j);
  	  }

  	  for (i = n - 1; i > 0; i--) {
  	    scale = 0;
  	    h = 0;
  	    for (k = 0; k < i; k++) {
  	      scale = scale + Math.abs(d[k]);
  	    }

  	    if (scale === 0) {
  	      e[i] = d[i - 1];
  	      for (j = 0; j < i; j++) {
  	        d[j] = V.get(i - 1, j);
  	        V.set(i, j, 0);
  	        V.set(j, i, 0);
  	      }
  	    } else {
  	      for (k = 0; k < i; k++) {
  	        d[k] /= scale;
  	        h += d[k] * d[k];
  	      }

  	      f = d[i - 1];
  	      g = Math.sqrt(h);
  	      if (f > 0) {
  	        g = -g;
  	      }

  	      e[i] = scale * g;
  	      h = h - f * g;
  	      d[i - 1] = f - g;
  	      for (j = 0; j < i; j++) {
  	        e[j] = 0;
  	      }

  	      for (j = 0; j < i; j++) {
  	        f = d[j];
  	        V.set(j, i, f);
  	        g = e[j] + V.get(j, j) * f;
  	        for (k = j + 1; k <= i - 1; k++) {
  	          g += V.get(k, j) * d[k];
  	          e[k] += V.get(k, j) * f;
  	        }
  	        e[j] = g;
  	      }

  	      f = 0;
  	      for (j = 0; j < i; j++) {
  	        e[j] /= h;
  	        f += e[j] * d[j];
  	      }

  	      hh = f / (h + h);
  	      for (j = 0; j < i; j++) {
  	        e[j] -= hh * d[j];
  	      }

  	      for (j = 0; j < i; j++) {
  	        f = d[j];
  	        g = e[j];
  	        for (k = j; k <= i - 1; k++) {
  	          V.set(k, j, V.get(k, j) - (f * e[k] + g * d[k]));
  	        }
  	        d[j] = V.get(i - 1, j);
  	        V.set(i, j, 0);
  	      }
  	    }
  	    d[i] = h;
  	  }

  	  for (i = 0; i < n - 1; i++) {
  	    V.set(n - 1, i, V.get(i, i));
  	    V.set(i, i, 1);
  	    h = d[i + 1];
  	    if (h !== 0) {
  	      for (k = 0; k <= i; k++) {
  	        d[k] = V.get(k, i + 1) / h;
  	      }

  	      for (j = 0; j <= i; j++) {
  	        g = 0;
  	        for (k = 0; k <= i; k++) {
  	          g += V.get(k, i + 1) * V.get(k, j);
  	        }
  	        for (k = 0; k <= i; k++) {
  	          V.set(k, j, V.get(k, j) - g * d[k]);
  	        }
  	      }
  	    }

  	    for (k = 0; k <= i; k++) {
  	      V.set(k, i + 1, 0);
  	    }
  	  }

  	  for (j = 0; j < n; j++) {
  	    d[j] = V.get(n - 1, j);
  	    V.set(n - 1, j, 0);
  	  }

  	  V.set(n - 1, n - 1, 1);
  	  e[0] = 0;
  	}

  	function tql2(n, e, d, V) {
  	  let g, h, i, j, k, l, m, p, r, dl1, c, c2, c3, el1, s, s2;

  	  for (i = 1; i < n; i++) {
  	    e[i - 1] = e[i];
  	  }

  	  e[n - 1] = 0;

  	  let f = 0;
  	  let tst1 = 0;
  	  let eps = Number.EPSILON;

  	  for (l = 0; l < n; l++) {
  	    tst1 = Math.max(tst1, Math.abs(d[l]) + Math.abs(e[l]));
  	    m = l;
  	    while (m < n) {
  	      if (Math.abs(e[m]) <= eps * tst1) {
  	        break;
  	      }
  	      m++;
  	    }

  	    if (m > l) {
  	      do {

  	        g = d[l];
  	        p = (d[l + 1] - g) / (2 * e[l]);
  	        r = hypotenuse(p, 1);
  	        if (p < 0) {
  	          r = -r;
  	        }

  	        d[l] = e[l] / (p + r);
  	        d[l + 1] = e[l] * (p + r);
  	        dl1 = d[l + 1];
  	        h = g - d[l];
  	        for (i = l + 2; i < n; i++) {
  	          d[i] -= h;
  	        }

  	        f = f + h;

  	        p = d[m];
  	        c = 1;
  	        c2 = c;
  	        c3 = c;
  	        el1 = e[l + 1];
  	        s = 0;
  	        s2 = 0;
  	        for (i = m - 1; i >= l; i--) {
  	          c3 = c2;
  	          c2 = c;
  	          s2 = s;
  	          g = c * e[i];
  	          h = c * p;
  	          r = hypotenuse(p, e[i]);
  	          e[i + 1] = s * r;
  	          s = e[i] / r;
  	          c = p / r;
  	          p = c * d[i] - s * g;
  	          d[i + 1] = h + s * (c * g + s * d[i]);

  	          for (k = 0; k < n; k++) {
  	            h = V.get(k, i + 1);
  	            V.set(k, i + 1, s * V.get(k, i) + c * h);
  	            V.set(k, i, c * V.get(k, i) - s * h);
  	          }
  	        }

  	        p = (-s * s2 * c3 * el1 * e[l]) / dl1;
  	        e[l] = s * p;
  	        d[l] = c * p;
  	      } while (Math.abs(e[l]) > eps * tst1);
  	    }
  	    d[l] = d[l] + f;
  	    e[l] = 0;
  	  }

  	  for (i = 0; i < n - 1; i++) {
  	    k = i;
  	    p = d[i];
  	    for (j = i + 1; j < n; j++) {
  	      if (d[j] < p) {
  	        k = j;
  	        p = d[j];
  	      }
  	    }

  	    if (k !== i) {
  	      d[k] = d[i];
  	      d[i] = p;
  	      for (j = 0; j < n; j++) {
  	        p = V.get(j, i);
  	        V.set(j, i, V.get(j, k));
  	        V.set(j, k, p);
  	      }
  	    }
  	  }
  	}

  	function orthes(n, H, ort, V) {
  	  let low = 0;
  	  let high = n - 1;
  	  let f, g, h, i, j, m;
  	  let scale;

  	  for (m = low + 1; m <= high - 1; m++) {
  	    scale = 0;
  	    for (i = m; i <= high; i++) {
  	      scale = scale + Math.abs(H.get(i, m - 1));
  	    }

  	    if (scale !== 0) {
  	      h = 0;
  	      for (i = high; i >= m; i--) {
  	        ort[i] = H.get(i, m - 1) / scale;
  	        h += ort[i] * ort[i];
  	      }

  	      g = Math.sqrt(h);
  	      if (ort[m] > 0) {
  	        g = -g;
  	      }

  	      h = h - ort[m] * g;
  	      ort[m] = ort[m] - g;

  	      for (j = m; j < n; j++) {
  	        f = 0;
  	        for (i = high; i >= m; i--) {
  	          f += ort[i] * H.get(i, j);
  	        }

  	        f = f / h;
  	        for (i = m; i <= high; i++) {
  	          H.set(i, j, H.get(i, j) - f * ort[i]);
  	        }
  	      }

  	      for (i = 0; i <= high; i++) {
  	        f = 0;
  	        for (j = high; j >= m; j--) {
  	          f += ort[j] * H.get(i, j);
  	        }

  	        f = f / h;
  	        for (j = m; j <= high; j++) {
  	          H.set(i, j, H.get(i, j) - f * ort[j]);
  	        }
  	      }

  	      ort[m] = scale * ort[m];
  	      H.set(m, m - 1, scale * g);
  	    }
  	  }

  	  for (i = 0; i < n; i++) {
  	    for (j = 0; j < n; j++) {
  	      V.set(i, j, i === j ? 1 : 0);
  	    }
  	  }

  	  for (m = high - 1; m >= low + 1; m--) {
  	    if (H.get(m, m - 1) !== 0) {
  	      for (i = m + 1; i <= high; i++) {
  	        ort[i] = H.get(i, m - 1);
  	      }

  	      for (j = m; j <= high; j++) {
  	        g = 0;
  	        for (i = m; i <= high; i++) {
  	          g += ort[i] * V.get(i, j);
  	        }

  	        g = g / ort[m] / H.get(m, m - 1);
  	        for (i = m; i <= high; i++) {
  	          V.set(i, j, V.get(i, j) + g * ort[i]);
  	        }
  	      }
  	    }
  	  }
  	}

  	function hqr2(nn, e, d, V, H) {
  	  let n = nn - 1;
  	  let low = 0;
  	  let high = nn - 1;
  	  let eps = Number.EPSILON;
  	  let exshift = 0;
  	  let norm = 0;
  	  let p = 0;
  	  let q = 0;
  	  let r = 0;
  	  let s = 0;
  	  let z = 0;
  	  let iter = 0;
  	  let i, j, k, l, m, t, w, x, y;
  	  let ra, sa, vr, vi;
  	  let notlast, cdivres;

  	  for (i = 0; i < nn; i++) {
  	    if (i < low || i > high) {
  	      d[i] = H.get(i, i);
  	      e[i] = 0;
  	    }

  	    for (j = Math.max(i - 1, 0); j < nn; j++) {
  	      norm = norm + Math.abs(H.get(i, j));
  	    }
  	  }

  	  while (n >= low) {
  	    l = n;
  	    while (l > low) {
  	      s = Math.abs(H.get(l - 1, l - 1)) + Math.abs(H.get(l, l));
  	      if (s === 0) {
  	        s = norm;
  	      }
  	      if (Math.abs(H.get(l, l - 1)) < eps * s) {
  	        break;
  	      }
  	      l--;
  	    }

  	    if (l === n) {
  	      H.set(n, n, H.get(n, n) + exshift);
  	      d[n] = H.get(n, n);
  	      e[n] = 0;
  	      n--;
  	      iter = 0;
  	    } else if (l === n - 1) {
  	      w = H.get(n, n - 1) * H.get(n - 1, n);
  	      p = (H.get(n - 1, n - 1) - H.get(n, n)) / 2;
  	      q = p * p + w;
  	      z = Math.sqrt(Math.abs(q));
  	      H.set(n, n, H.get(n, n) + exshift);
  	      H.set(n - 1, n - 1, H.get(n - 1, n - 1) + exshift);
  	      x = H.get(n, n);

  	      if (q >= 0) {
  	        z = p >= 0 ? p + z : p - z;
  	        d[n - 1] = x + z;
  	        d[n] = d[n - 1];
  	        if (z !== 0) {
  	          d[n] = x - w / z;
  	        }
  	        e[n - 1] = 0;
  	        e[n] = 0;
  	        x = H.get(n, n - 1);
  	        s = Math.abs(x) + Math.abs(z);
  	        p = x / s;
  	        q = z / s;
  	        r = Math.sqrt(p * p + q * q);
  	        p = p / r;
  	        q = q / r;

  	        for (j = n - 1; j < nn; j++) {
  	          z = H.get(n - 1, j);
  	          H.set(n - 1, j, q * z + p * H.get(n, j));
  	          H.set(n, j, q * H.get(n, j) - p * z);
  	        }

  	        for (i = 0; i <= n; i++) {
  	          z = H.get(i, n - 1);
  	          H.set(i, n - 1, q * z + p * H.get(i, n));
  	          H.set(i, n, q * H.get(i, n) - p * z);
  	        }

  	        for (i = low; i <= high; i++) {
  	          z = V.get(i, n - 1);
  	          V.set(i, n - 1, q * z + p * V.get(i, n));
  	          V.set(i, n, q * V.get(i, n) - p * z);
  	        }
  	      } else {
  	        d[n - 1] = x + p;
  	        d[n] = x + p;
  	        e[n - 1] = z;
  	        e[n] = -z;
  	      }

  	      n = n - 2;
  	      iter = 0;
  	    } else {
  	      x = H.get(n, n);
  	      y = 0;
  	      w = 0;
  	      if (l < n) {
  	        y = H.get(n - 1, n - 1);
  	        w = H.get(n, n - 1) * H.get(n - 1, n);
  	      }

  	      if (iter === 10) {
  	        exshift += x;
  	        for (i = low; i <= n; i++) {
  	          H.set(i, i, H.get(i, i) - x);
  	        }
  	        s = Math.abs(H.get(n, n - 1)) + Math.abs(H.get(n - 1, n - 2));
  	        // eslint-disable-next-line no-multi-assign
  	        x = y = 0.75 * s;
  	        w = -0.4375 * s * s;
  	      }

  	      if (iter === 30) {
  	        s = (y - x) / 2;
  	        s = s * s + w;
  	        if (s > 0) {
  	          s = Math.sqrt(s);
  	          if (y < x) {
  	            s = -s;
  	          }
  	          s = x - w / ((y - x) / 2 + s);
  	          for (i = low; i <= n; i++) {
  	            H.set(i, i, H.get(i, i) - s);
  	          }
  	          exshift += s;
  	          // eslint-disable-next-line no-multi-assign
  	          x = y = w = 0.964;
  	        }
  	      }

  	      iter = iter + 1;

  	      m = n - 2;
  	      while (m >= l) {
  	        z = H.get(m, m);
  	        r = x - z;
  	        s = y - z;
  	        p = (r * s - w) / H.get(m + 1, m) + H.get(m, m + 1);
  	        q = H.get(m + 1, m + 1) - z - r - s;
  	        r = H.get(m + 2, m + 1);
  	        s = Math.abs(p) + Math.abs(q) + Math.abs(r);
  	        p = p / s;
  	        q = q / s;
  	        r = r / s;
  	        if (m === l) {
  	          break;
  	        }
  	        if (
  	          Math.abs(H.get(m, m - 1)) * (Math.abs(q) + Math.abs(r)) <
  	          eps *
  	            (Math.abs(p) *
  	              (Math.abs(H.get(m - 1, m - 1)) +
  	                Math.abs(z) +
  	                Math.abs(H.get(m + 1, m + 1))))
  	        ) {
  	          break;
  	        }
  	        m--;
  	      }

  	      for (i = m + 2; i <= n; i++) {
  	        H.set(i, i - 2, 0);
  	        if (i > m + 2) {
  	          H.set(i, i - 3, 0);
  	        }
  	      }

  	      for (k = m; k <= n - 1; k++) {
  	        notlast = k !== n - 1;
  	        if (k !== m) {
  	          p = H.get(k, k - 1);
  	          q = H.get(k + 1, k - 1);
  	          r = notlast ? H.get(k + 2, k - 1) : 0;
  	          x = Math.abs(p) + Math.abs(q) + Math.abs(r);
  	          if (x !== 0) {
  	            p = p / x;
  	            q = q / x;
  	            r = r / x;
  	          }
  	        }

  	        if (x === 0) {
  	          break;
  	        }

  	        s = Math.sqrt(p * p + q * q + r * r);
  	        if (p < 0) {
  	          s = -s;
  	        }

  	        if (s !== 0) {
  	          if (k !== m) {
  	            H.set(k, k - 1, -s * x);
  	          } else if (l !== m) {
  	            H.set(k, k - 1, -H.get(k, k - 1));
  	          }

  	          p = p + s;
  	          x = p / s;
  	          y = q / s;
  	          z = r / s;
  	          q = q / p;
  	          r = r / p;

  	          for (j = k; j < nn; j++) {
  	            p = H.get(k, j) + q * H.get(k + 1, j);
  	            if (notlast) {
  	              p = p + r * H.get(k + 2, j);
  	              H.set(k + 2, j, H.get(k + 2, j) - p * z);
  	            }

  	            H.set(k, j, H.get(k, j) - p * x);
  	            H.set(k + 1, j, H.get(k + 1, j) - p * y);
  	          }

  	          for (i = 0; i <= Math.min(n, k + 3); i++) {
  	            p = x * H.get(i, k) + y * H.get(i, k + 1);
  	            if (notlast) {
  	              p = p + z * H.get(i, k + 2);
  	              H.set(i, k + 2, H.get(i, k + 2) - p * r);
  	            }

  	            H.set(i, k, H.get(i, k) - p);
  	            H.set(i, k + 1, H.get(i, k + 1) - p * q);
  	          }

  	          for (i = low; i <= high; i++) {
  	            p = x * V.get(i, k) + y * V.get(i, k + 1);
  	            if (notlast) {
  	              p = p + z * V.get(i, k + 2);
  	              V.set(i, k + 2, V.get(i, k + 2) - p * r);
  	            }

  	            V.set(i, k, V.get(i, k) - p);
  	            V.set(i, k + 1, V.get(i, k + 1) - p * q);
  	          }
  	        }
  	      }
  	    }
  	  }

  	  if (norm === 0) {
  	    return;
  	  }

  	  for (n = nn - 1; n >= 0; n--) {
  	    p = d[n];
  	    q = e[n];

  	    if (q === 0) {
  	      l = n;
  	      H.set(n, n, 1);
  	      for (i = n - 1; i >= 0; i--) {
  	        w = H.get(i, i) - p;
  	        r = 0;
  	        for (j = l; j <= n; j++) {
  	          r = r + H.get(i, j) * H.get(j, n);
  	        }

  	        if (e[i] < 0) {
  	          z = w;
  	          s = r;
  	        } else {
  	          l = i;
  	          if (e[i] === 0) {
  	            H.set(i, n, w !== 0 ? -r / w : -r / (eps * norm));
  	          } else {
  	            x = H.get(i, i + 1);
  	            y = H.get(i + 1, i);
  	            q = (d[i] - p) * (d[i] - p) + e[i] * e[i];
  	            t = (x * s - z * r) / q;
  	            H.set(i, n, t);
  	            H.set(
  	              i + 1,
  	              n,
  	              Math.abs(x) > Math.abs(z) ? (-r - w * t) / x : (-s - y * t) / z,
  	            );
  	          }

  	          t = Math.abs(H.get(i, n));
  	          if (eps * t * t > 1) {
  	            for (j = i; j <= n; j++) {
  	              H.set(j, n, H.get(j, n) / t);
  	            }
  	          }
  	        }
  	      }
  	    } else if (q < 0) {
  	      l = n - 1;

  	      if (Math.abs(H.get(n, n - 1)) > Math.abs(H.get(n - 1, n))) {
  	        H.set(n - 1, n - 1, q / H.get(n, n - 1));
  	        H.set(n - 1, n, -(H.get(n, n) - p) / H.get(n, n - 1));
  	      } else {
  	        cdivres = cdiv(0, -H.get(n - 1, n), H.get(n - 1, n - 1) - p, q);
  	        H.set(n - 1, n - 1, cdivres[0]);
  	        H.set(n - 1, n, cdivres[1]);
  	      }

  	      H.set(n, n - 1, 0);
  	      H.set(n, n, 1);
  	      for (i = n - 2; i >= 0; i--) {
  	        ra = 0;
  	        sa = 0;
  	        for (j = l; j <= n; j++) {
  	          ra = ra + H.get(i, j) * H.get(j, n - 1);
  	          sa = sa + H.get(i, j) * H.get(j, n);
  	        }

  	        w = H.get(i, i) - p;

  	        if (e[i] < 0) {
  	          z = w;
  	          r = ra;
  	          s = sa;
  	        } else {
  	          l = i;
  	          if (e[i] === 0) {
  	            cdivres = cdiv(-ra, -sa, w, q);
  	            H.set(i, n - 1, cdivres[0]);
  	            H.set(i, n, cdivres[1]);
  	          } else {
  	            x = H.get(i, i + 1);
  	            y = H.get(i + 1, i);
  	            vr = (d[i] - p) * (d[i] - p) + e[i] * e[i] - q * q;
  	            vi = (d[i] - p) * 2 * q;
  	            if (vr === 0 && vi === 0) {
  	              vr =
  	                eps *
  	                norm *
  	                (Math.abs(w) +
  	                  Math.abs(q) +
  	                  Math.abs(x) +
  	                  Math.abs(y) +
  	                  Math.abs(z));
  	            }
  	            cdivres = cdiv(
  	              x * r - z * ra + q * sa,
  	              x * s - z * sa - q * ra,
  	              vr,
  	              vi,
  	            );
  	            H.set(i, n - 1, cdivres[0]);
  	            H.set(i, n, cdivres[1]);
  	            if (Math.abs(x) > Math.abs(z) + Math.abs(q)) {
  	              H.set(
  	                i + 1,
  	                n - 1,
  	                (-ra - w * H.get(i, n - 1) + q * H.get(i, n)) / x,
  	              );
  	              H.set(
  	                i + 1,
  	                n,
  	                (-sa - w * H.get(i, n) - q * H.get(i, n - 1)) / x,
  	              );
  	            } else {
  	              cdivres = cdiv(
  	                -r - y * H.get(i, n - 1),
  	                -s - y * H.get(i, n),
  	                z,
  	                q,
  	              );
  	              H.set(i + 1, n - 1, cdivres[0]);
  	              H.set(i + 1, n, cdivres[1]);
  	            }
  	          }

  	          t = Math.max(Math.abs(H.get(i, n - 1)), Math.abs(H.get(i, n)));
  	          if (eps * t * t > 1) {
  	            for (j = i; j <= n; j++) {
  	              H.set(j, n - 1, H.get(j, n - 1) / t);
  	              H.set(j, n, H.get(j, n) / t);
  	            }
  	          }
  	        }
  	      }
  	    }
  	  }

  	  for (i = 0; i < nn; i++) {
  	    if (i < low || i > high) {
  	      for (j = i; j < nn; j++) {
  	        V.set(i, j, H.get(i, j));
  	      }
  	    }
  	  }

  	  for (j = nn - 1; j >= low; j--) {
  	    for (i = low; i <= high; i++) {
  	      z = 0;
  	      for (k = low; k <= Math.min(j, high); k++) {
  	        z = z + V.get(i, k) * H.get(k, j);
  	      }
  	      V.set(i, j, z);
  	    }
  	  }
  	}

  	function cdiv(xr, xi, yr, yi) {
  	  let r, d;
  	  if (Math.abs(yr) > Math.abs(yi)) {
  	    r = yi / yr;
  	    d = yr + r * yi;
  	    return [(xr + r * xi) / d, (xi - r * xr) / d];
  	  } else {
  	    r = yr / yi;
  	    d = yi + r * yr;
  	    return [(r * xr + xi) / d, (r * xi - xr) / d];
  	  }
  	}

  	class CholeskyDecomposition {
  	  constructor(value) {
  	    value = WrapperMatrix2D.checkMatrix(value);
  	    if (!value.isSymmetric()) {
  	      throw new Error('Matrix is not symmetric');
  	    }

  	    let a = value;
  	    let dimension = a.rows;
  	    let l = new Matrix(dimension, dimension);
  	    let positiveDefinite = true;
  	    let i, j, k;

  	    for (j = 0; j < dimension; j++) {
  	      let d = 0;
  	      for (k = 0; k < j; k++) {
  	        let s = 0;
  	        for (i = 0; i < k; i++) {
  	          s += l.get(k, i) * l.get(j, i);
  	        }
  	        s = (a.get(j, k) - s) / l.get(k, k);
  	        l.set(j, k, s);
  	        d = d + s * s;
  	      }

  	      d = a.get(j, j) - d;

  	      positiveDefinite &&= d > 0;
  	      l.set(j, j, Math.sqrt(Math.max(d, 0)));
  	      for (k = j + 1; k < dimension; k++) {
  	        l.set(j, k, 0);
  	      }
  	    }

  	    this.L = l;
  	    this.positiveDefinite = positiveDefinite;
  	  }

  	  isPositiveDefinite() {
  	    return this.positiveDefinite;
  	  }

  	  solve(value) {
  	    value = WrapperMatrix2D.checkMatrix(value);

  	    let l = this.L;
  	    let dimension = l.rows;

  	    if (value.rows !== dimension) {
  	      throw new Error('Matrix dimensions do not match');
  	    }
  	    if (this.isPositiveDefinite() === false) {
  	      throw new Error('Matrix is not positive definite');
  	    }

  	    let count = value.columns;
  	    let B = value.clone();
  	    let i, j, k;

  	    for (k = 0; k < dimension; k++) {
  	      for (j = 0; j < count; j++) {
  	        for (i = 0; i < k; i++) {
  	          B.set(k, j, B.get(k, j) - B.get(i, j) * l.get(k, i));
  	        }
  	        B.set(k, j, B.get(k, j) / l.get(k, k));
  	      }
  	    }

  	    for (k = dimension - 1; k >= 0; k--) {
  	      for (j = 0; j < count; j++) {
  	        for (i = k + 1; i < dimension; i++) {
  	          B.set(k, j, B.get(k, j) - B.get(i, j) * l.get(i, k));
  	        }
  	        B.set(k, j, B.get(k, j) / l.get(k, k));
  	      }
  	    }

  	    return B;
  	  }

  	  get lowerTriangularMatrix() {
  	    return this.L;
  	  }
  	}

  	class nipals {
  	  constructor(X, options = {}) {
  	    X = WrapperMatrix2D.checkMatrix(X);
  	    let { Y } = options;
  	    const {
  	      scaleScores = false,
  	      maxIterations = 1000,
  	      terminationCriteria = 1e-10,
  	    } = options;

  	    let u;
  	    if (Y) {
  	      if (isAnyArray.isAnyArray(Y) && typeof Y[0] === 'number') {
  	        Y = Matrix.columnVector(Y);
  	      } else {
  	        Y = WrapperMatrix2D.checkMatrix(Y);
  	      }
  	      if (Y.rows !== X.rows) {
  	        throw new Error('Y should have the same number of rows as X');
  	      }
  	      u = Y.getColumnVector(0);
  	    } else {
  	      u = X.getColumnVector(0);
  	    }

  	    let diff = 1;
  	    let t, q, w, tOld;

  	    for (
  	      let counter = 0;
  	      counter < maxIterations && diff > terminationCriteria;
  	      counter++
  	    ) {
  	      w = X.transpose().mmul(u).div(u.transpose().mmul(u).get(0, 0));
  	      w = w.div(w.norm());

  	      t = X.mmul(w).div(w.transpose().mmul(w).get(0, 0));

  	      if (counter > 0) {
  	        diff = t.clone().sub(tOld).pow(2).sum();
  	      }
  	      tOld = t.clone();

  	      if (Y) {
  	        q = Y.transpose().mmul(t).div(t.transpose().mmul(t).get(0, 0));
  	        q = q.div(q.norm());

  	        u = Y.mmul(q).div(q.transpose().mmul(q).get(0, 0));
  	      } else {
  	        u = t;
  	      }
  	    }

  	    if (Y) {
  	      let p = X.transpose().mmul(t).div(t.transpose().mmul(t).get(0, 0));
  	      p = p.div(p.norm());
  	      let xResidual = X.clone().sub(t.clone().mmul(p.transpose()));
  	      let residual = u.transpose().mmul(t).div(t.transpose().mmul(t).get(0, 0));
  	      let yResidual = Y.clone().sub(
  	        t.clone().mulS(residual.get(0, 0)).mmul(q.transpose()),
  	      );

  	      this.t = t;
  	      this.p = p.transpose();
  	      this.w = w.transpose();
  	      this.q = q;
  	      this.u = u;
  	      this.s = t.transpose().mmul(t);
  	      this.xResidual = xResidual;
  	      this.yResidual = yResidual;
  	      this.betas = residual;
  	    } else {
  	      this.w = w.transpose();
  	      this.s = t.transpose().mmul(t).sqrt();
  	      if (scaleScores) {
  	        this.t = t.clone().div(this.s.get(0, 0));
  	      } else {
  	        this.t = t;
  	      }
  	      this.xResidual = X.sub(t.mmul(w.transpose()));
  	    }
  	  }
  	}

  	matrix$1.AbstractMatrix = AbstractMatrix;
  	matrix$1.CHO = CholeskyDecomposition;
  	matrix$1.CholeskyDecomposition = CholeskyDecomposition;
  	matrix$1.DistanceMatrix = DistanceMatrix;
  	matrix$1.EVD = EigenvalueDecomposition;
  	matrix$1.EigenvalueDecomposition = EigenvalueDecomposition;
  	matrix$1.LU = LuDecomposition;
  	matrix$1.LuDecomposition = LuDecomposition;
  	matrix$1.Matrix = Matrix;
  	matrix$1.MatrixColumnSelectionView = MatrixColumnSelectionView;
  	matrix$1.MatrixColumnView = MatrixColumnView;
  	matrix$1.MatrixFlipColumnView = MatrixFlipColumnView;
  	matrix$1.MatrixFlipRowView = MatrixFlipRowView;
  	matrix$1.MatrixRowSelectionView = MatrixRowSelectionView;
  	matrix$1.MatrixRowView = MatrixRowView;
  	matrix$1.MatrixSelectionView = MatrixSelectionView;
  	matrix$1.MatrixSubView = MatrixSubView;
  	matrix$1.MatrixTransposeView = MatrixTransposeView;
  	matrix$1.NIPALS = nipals;
  	matrix$1.Nipals = nipals;
  	matrix$1.QR = QrDecomposition;
  	matrix$1.QrDecomposition = QrDecomposition;
  	matrix$1.SVD = SingularValueDecomposition;
  	matrix$1.SingularValueDecomposition = SingularValueDecomposition;
  	matrix$1.SymmetricMatrix = SymmetricMatrix;
  	matrix$1.WrapperMatrix1D = WrapperMatrix1D;
  	matrix$1.WrapperMatrix2D = WrapperMatrix2D;
  	matrix$1.correlation = correlation;
  	matrix$1.covariance = covariance;
  	matrix$1.default = Matrix;
  	matrix$1.determinant = determinant;
  	matrix$1.inverse = inverse;
  	matrix$1.linearDependencies = linearDependencies;
  	matrix$1.pseudoInverse = pseudoInverse;
  	matrix$1.solve = solve;
  	matrix$1.wrap = wrap;
  	return matrix$1;
  }

  var matrixExports = /*@__PURE__*/ requireMatrix();
  var matrix = /*@__PURE__*/getDefaultExportFromCjs(matrixExports);

  const Matrix = matrixExports.Matrix;
  const SingularValueDecomposition = matrixExports.SingularValueDecomposition;
  matrix.Matrix ? matrix.Matrix : matrixExports.Matrix;

  const DEFAULTS_LAYOUT_OPTIONS$7 = {
      center: [0, 0],
      linkDistance: 50,
  };
  /**
   * <zh/> 多维缩放算法布局
   *
   * <en/> Multidimensional scaling layout
   */
  class MDSLayout {
      constructor(options = {}) {
          this.options = options;
          this.id = 'mds';
          this.options = Object.assign(Object.assign({}, DEFAULTS_LAYOUT_OPTIONS$7), options);
      }
      /**
       * Return the positions of nodes and edges(if needed).
       */
      execute(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              return this.genericMDSLayout(false, graph, options);
          });
      }
      /**
       * To directly assign the positions to the nodes.
       */
      assign(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              yield this.genericMDSLayout(true, graph, options);
          });
      }
      genericMDSLayout(assign, graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              const mergedOptions = Object.assign(Object.assign({}, this.options), options);
              const { center = [0, 0], linkDistance = 50 } = mergedOptions;
              const nodes = graph.getAllNodes();
              const edges = graph.getAllEdges();
              if (!(nodes === null || nodes === void 0 ? void 0 : nodes.length) || nodes.length === 1) {
                  return handleSingleNodeGraph(graph, assign, center);
              }
              // the graph-theoretic distance (shortest path distance) matrix
              const adjMatrix = getAdjMatrix({ nodes, edges });
              const distances = floydWarshall(adjMatrix);
              handleInfinity$1(distances);
              // scale the ideal edge length acoording to linkDistance
              const scaledD = scaleMatrix(distances, linkDistance);
              // get positions by MDS
              const positions = runMDS(scaledD);
              const layoutNodes = [];
              positions.forEach((p, i) => {
                  const cnode = cloneFormatData(nodes[i]);
                  cnode.data.x = p[0] + center[0];
                  cnode.data.y = p[1] + center[1];
                  layoutNodes.push(cnode);
              });
              if (assign) {
                  layoutNodes.forEach((node) => graph.mergeNodeData(node.id, {
                      x: node.data.x,
                      y: node.data.y,
                  }));
              }
              const result = {
                  nodes: layoutNodes,
                  edges,
              };
              return result;
          });
      }
  }
  const handleInfinity$1 = (distances) => {
      let maxDistance = -999999;
      distances.forEach((row) => {
          row.forEach((value) => {
              if (value === Infinity) {
                  return;
              }
              if (maxDistance < value) {
                  maxDistance = value;
              }
          });
      });
      distances.forEach((row, i) => {
          row.forEach((value, j) => {
              if (value === Infinity) {
                  distances[i][j] = maxDistance;
              }
          });
      });
  };
  /**
   * mds 算法
   * @return {array} positions 计算后的节点位置数组
   */
  const runMDS = (distances) => {
      const dimension = 2;
      // square distances
      const M = Matrix.mul(Matrix.pow(distances, 2), -0.5);
      // double centre the rows/columns
      const rowMeans = M.mean('row');
      const colMeans = M.mean('column');
      const totalMean = M.mean();
      M.add(totalMean).subRowVector(rowMeans).subColumnVector(colMeans);
      // take the SVD of the double centred matrix, and return the
      // points from it
      const ret = new SingularValueDecomposition(M);
      const eigenValues = Matrix.sqrt(ret.diagonalMatrix).diagonal();
      return ret.leftSingularVectors.toJSON().map((row) => {
          return Matrix.mul([row], [eigenValues])
              .toJSON()[0]
              .splice(0, dimension);
      });
  };

  function isLayoutWithIterations(layout) {
      return !!layout.tick && !!layout.stop;
  }

  const FORCE_LAYOUT_TYPE_MAP = {
      gForce: true,
      force2: true,
      d3force: true,
      fruchterman: true,
      forceAtlas2: true,
      force: true,
      'graphin-force': true,
  };
  const DEFAULTS_LAYOUT_OPTIONS$6 = {
      center: [0, 0],
      comboPadding: 10,
      treeKey: 'combo',
  };
  /**
   * <zh/> 组合布局
   *
   * <en/> Combo-Combined layout
   */
  class ComboCombinedLayout {
      constructor(options = {}) {
          this.options = options;
          this.id = 'comboCombined';
          this.options = Object.assign(Object.assign({}, DEFAULTS_LAYOUT_OPTIONS$6), options);
      }
      /**
       * Return the positions of nodes and edges(if needed).
       */
      execute(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              return this.genericComboCombinedLayout(false, graph, options);
          });
      }
      /**
       * To directly assign the positions to the nodes.
       */
      assign(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              yield this.genericComboCombinedLayout(true, graph, options);
          });
      }
      genericComboCombinedLayout(assign, graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              const mergedOptions = this.initVals(Object.assign(Object.assign({}, this.options), options));
              const { center, treeKey, outerLayout: propsOuterLayout } = mergedOptions;
              const nodes = graph
                  .getAllNodes()
                  .filter((node) => !node.data._isCombo);
              const combos = graph
                  .getAllNodes()
                  .filter((node) => node.data._isCombo);
              const edges = graph.getAllEdges();
              const n = nodes === null || nodes === void 0 ? void 0 : nodes.length;
              if (!n || n === 1) {
                  return handleSingleNodeGraph(graph, assign, center);
              }
              // output nodes
              const layoutNodes = [];
              const nodeMap = new Map();
              nodes.forEach((node) => {
                  nodeMap.set(node.id, node);
              });
              const comboMap = new Map();
              combos.forEach((combo) => {
                  comboMap.set(combo.id, combo);
              });
              // each one in comboNodes is a combo contains the size and child nodes
              // comboNodes includes the node who has no parent combo
              const comboNodes = new Map();
              // the inner layouts, the result positions are stored in comboNodes and their child nodes
              const innerGraphLayoutPromises = this.getInnerGraphs(graph, treeKey, nodeMap, comboMap, edges, mergedOptions, comboNodes);
              yield Promise.all(innerGraphLayoutPromises);
              const outerNodeIds = new Map();
              const outerLayoutNodes = [];
              const nodeAncestorIdMap = new Map();
              let allHaveNoPosition = true;
              graph.getRoots(treeKey).forEach((root) => {
                  const combo = comboNodes.get(root.id);
                  const cacheCombo = comboMap.get(root.id) || nodeMap.get(root.id);
                  const comboLayoutNode = {
                      id: root.id,
                      data: Object.assign(Object.assign({}, root.data), { x: combo.data.x || cacheCombo.data.x, y: combo.data.y || cacheCombo.data.y, fx: combo.data.fx || cacheCombo.data.fx, fy: combo.data.fy || cacheCombo.data.fy, mass: combo.data.mass || cacheCombo.data.mass, size: combo.data.size }),
                  };
                  outerLayoutNodes.push(comboLayoutNode);
                  outerNodeIds.set(root.id, true);
                  if (!isNaN(comboLayoutNode.data.x) &&
                      comboLayoutNode.data.x !== 0 &&
                      !isNaN(comboLayoutNode.data.y) &&
                      comboLayoutNode.data.y !== 0) {
                      allHaveNoPosition = false;
                  }
                  else {
                      comboLayoutNode.data.x = Math.random() * 100;
                      comboLayoutNode.data.y = Math.random() * 100;
                  }
                  graphTreeDfs(graph, [root], (child) => {
                      if (child.id !== root.id)
                          nodeAncestorIdMap.set(child.id, root.id);
                  }, 'TB', treeKey);
              });
              const outerLayoutEdges = [];
              edges.forEach((edge) => {
                  const sourceAncestorId = nodeAncestorIdMap.get(edge.source) || edge.source;
                  const targetAncestorId = nodeAncestorIdMap.get(edge.target) || edge.target;
                  // create an edge for outer layout if both source and target's ancestor combo is in outer layout nodes
                  if (sourceAncestorId !== targetAncestorId &&
                      outerNodeIds.has(sourceAncestorId) &&
                      outerNodeIds.has(targetAncestorId)) {
                      outerLayoutEdges.push({
                          id: edge.id,
                          source: sourceAncestorId,
                          target: targetAncestorId,
                          data: {},
                      });
                  }
              });
              // 若有需要最外层的 combo 或节点，则对最外层执行力导向
              let outerPositions;
              if (outerLayoutNodes === null || outerLayoutNodes === void 0 ? void 0 : outerLayoutNodes.length) {
                  if (outerLayoutNodes.length === 1) {
                      outerLayoutNodes[0].data.x = center[0];
                      outerLayoutNodes[0].data.y = center[1];
                  }
                  else {
                      const outerLayoutGraph = new Graph({
                          nodes: outerLayoutNodes,
                          edges: outerLayoutEdges,
                      });
                      const outerLayout = propsOuterLayout || new ForceLayout();
                      // preset the nodes if the outerLayout is a force family layout
                      if (allHaveNoPosition && FORCE_LAYOUT_TYPE_MAP[outerLayout.id]) {
                          const outerLayoutPreset = outerLayoutNodes.length < 100
                              ? new MDSLayout()
                              : new ConcentricLayout();
                          yield outerLayoutPreset.assign(outerLayoutGraph);
                      }
                      const options = Object.assign({ center, kg: 5, preventOverlap: true, animate: false }, (outerLayout.id === 'force'
                          ? {
                              gravity: 1,
                              factor: 4,
                              linkDistance: (edge, source, target) => {
                                  const sourceSize = Math.max(...source.data.size) || 32;
                                  const targetSize = Math.max(...target.data.size) || 32;
                                  return sourceSize / 2 + targetSize / 2 + 200;
                              },
                          }
                          : {}));
                      outerPositions = yield executeLayout(outerLayout, outerLayoutGraph, options);
                  }
                  // move the combos and their child nodes
                  comboNodes.forEach((comboNode) => {
                      var _a;
                      const outerPosition = outerPositions.nodes.find((pos) => pos.id === comboNode.id);
                      if (outerPosition) {
                          // if it is one of the outer layout nodes, update the positions
                          const { x, y } = outerPosition.data;
                          comboNode.data.visited = true;
                          comboNode.data.x = x;
                          comboNode.data.y = y;
                          layoutNodes.push({
                              id: comboNode.id,
                              data: { x, y },
                          });
                      }
                      // move the child nodes
                      const { x, y } = comboNode.data;
                      (_a = comboNode.data.nodes) === null || _a === void 0 ? void 0 : _a.forEach((node) => {
                          layoutNodes.push({
                              id: node.id,
                              data: { x: node.data.x + x, y: node.data.y + y },
                          });
                      });
                  });
                  // move the nodes from top to bottom
                  comboNodes.forEach(({ data }) => {
                      const { x, y, visited, nodes } = data;
                      nodes === null || nodes === void 0 ? void 0 : nodes.forEach((node) => {
                          if (!visited) {
                              const layoutNode = layoutNodes.find((n) => n.id === node.id);
                              layoutNode.data.x += x || 0;
                              layoutNode.data.y += y || 0;
                          }
                      });
                  });
              }
              if (assign) {
                  layoutNodes.forEach((node) => {
                      graph.mergeNodeData(node.id, {
                          x: node.data.x,
                          y: node.data.y,
                      });
                  });
              }
              const result = {
                  nodes: layoutNodes,
                  edges,
              };
              return result;
          });
      }
      initVals(options) {
          const formattedOptions = Object.assign({}, options);
          const { nodeSize, spacing, comboPadding } = options;
          let nodeSizeFunc;
          let spacingFunc;
          // nodeSpacing to function
          if (isNumber(spacing)) {
              spacingFunc = () => spacing;
          }
          else if (isFunction(spacing)) {
              spacingFunc = spacing;
          }
          else {
              spacingFunc = () => 0;
          }
          formattedOptions.spacing = spacingFunc;
          // nodeSize to function
          if (!nodeSize) {
              nodeSizeFunc = (d) => {
                  const spacing = spacingFunc(d);
                  if (d.size) {
                      if (isArray(d.size)) {
                          const res = d.size[0] > d.size[1] ? d.size[0] : d.size[1];
                          return (res + spacing) / 2;
                      }
                      if (isObject(d.size)) {
                          const res = d.size.width > d.size.height ? d.size.width : d.size.height;
                          return (res + spacing) / 2;
                      }
                      return (d.size + spacing) / 2;
                  }
                  return 32 + spacing / 2;
              };
          }
          else if (isFunction(nodeSize)) {
              nodeSizeFunc = (d) => {
                  const size = nodeSize(d);
                  const spacing = spacingFunc(d);
                  if (isArray(d.size)) {
                      const res = d.size[0] > d.size[1] ? d.size[0] : d.size[1];
                      return (res + spacing) / 2;
                  }
                  return ((size || 32) + spacing) / 2;
              };
          }
          else if (isArray(nodeSize)) {
              const larger = nodeSize[0] > nodeSize[1] ? nodeSize[0] : nodeSize[1];
              const radius = larger / 2;
              nodeSizeFunc = (d) => radius + spacingFunc(d) / 2;
          }
          else {
              // number type
              const radius = nodeSize / 2;
              nodeSizeFunc = (d) => radius + spacingFunc(d) / 2;
          }
          formattedOptions.nodeSize = nodeSizeFunc;
          // comboPadding to function
          let comboPaddingFunc;
          if (isNumber(comboPadding)) {
              comboPaddingFunc = () => comboPadding;
          }
          else if (isArray(comboPadding)) {
              comboPaddingFunc = () => Math.max.apply(null, comboPadding);
          }
          else if (isFunction(comboPadding)) {
              comboPaddingFunc = comboPadding;
          }
          else {
              // null type
              comboPaddingFunc = () => 0;
          }
          formattedOptions.comboPadding = comboPaddingFunc;
          return formattedOptions;
      }
      getInnerGraphs(graph, treeKey, nodeMap, comboMap, edges, options, comboNodes) {
          const { nodeSize, comboPadding, spacing, innerLayout } = options;
          const innerGraphLayout = innerLayout || new ConcentricLayout({});
          const innerLayoutOptions = {
              center: [0, 0],
              preventOverlap: true,
              nodeSpacing: spacing,
          };
          const innerLayoutPromises = [];
          const getSize = (node) => {
              // @ts-ignore
              let padding = (comboPadding === null || comboPadding === void 0 ? void 0 : comboPadding(node)) || 10;
              if (isArray(padding))
                  padding = Math.max(...padding);
              return {
                  size: padding ? [padding * 2, padding * 2] : [30, 30],
                  padding,
              };
          };
          graph.getRoots(treeKey).forEach((root) => {
              // @ts-ignore
              comboNodes.set(root.id, {
                  id: root.id,
                  data: {
                      nodes: [],
                      size: getSize(root).size,
                  },
              });
              let start = Promise.resolve();
              // Regard the child nodes in one combo as a graph, and layout them from bottom to top
              graphTreeDfs(graph, [root], (treeNode) => {
                  var _a;
                  if (!treeNode.data._isCombo)
                      return;
                  const { size: nsize, padding } = getSize(treeNode);
                  if (!((_a = graph.getChildren(treeNode.id, treeKey)) === null || _a === void 0 ? void 0 : _a.length)) {
                      // empty combo
                      comboNodes.set(treeNode.id, {
                          id: treeNode.id,
                          data: Object.assign(Object.assign({}, treeNode.data), { size: nsize }),
                      });
                  }
                  else {
                      // combo not empty
                      const comboNode = comboNodes.get(treeNode.id);
                      comboNodes.set(treeNode.id, {
                          id: treeNode.id,
                          data: Object.assign({ nodes: [] }, comboNode === null || comboNode === void 0 ? void 0 : comboNode.data),
                      });
                      const innerLayoutNodeIds = new Map();
                      const innerLayoutNodes = graph
                          .getChildren(treeNode.id, treeKey)
                          .map((child) => {
                          if (child.data._isCombo) {
                              if (!comboNodes.has(child.id)) {
                                  comboNodes.set(child.id, {
                                      id: child.id,
                                      data: Object.assign({}, child.data),
                                  });
                              }
                              innerLayoutNodeIds.set(child.id, true);
                              return comboNodes.get(child.id);
                          }
                          const oriNode = nodeMap.get(child.id) || comboMap.get(child.id);
                          innerLayoutNodeIds.set(child.id, true);
                          return {
                              id: child.id,
                              data: Object.assign(Object.assign({}, oriNode.data), child.data),
                          };
                      });
                      const innerGraphData = {
                          nodes: innerLayoutNodes,
                          edges: edges.filter((edge) => innerLayoutNodeIds.has(edge.source) &&
                              innerLayoutNodeIds.has(edge.target)),
                      };
                      let minNodeSize = Infinity;
                      innerLayoutNodes.forEach((node) => {
                          var _a;
                          let { size } = node.data;
                          if (!size) {
                              size = ((_a = comboNodes.get(node.id)) === null || _a === void 0 ? void 0 : _a.data.size) ||
                                  (nodeSize === null || nodeSize === void 0 ? void 0 : nodeSize(node)) || [30, 30];
                          }
                          if (isNumber(size))
                              size = [size, size];
                          const [size0, size1] = size;
                          if (minNodeSize > size0)
                              minNodeSize = size0;
                          if (minNodeSize > size1)
                              minNodeSize = size1;
                          node.data.size = size;
                      });
                      // innerGraphLayout.assign(innerGraphCore, innerLayoutOptions);
                      start = start.then(() => __awaiter(this, void 0, void 0, function* () {
                          const innerGraphCore = new Graph(innerGraphData);
                          yield executeLayout(innerGraphLayout, innerGraphCore, innerLayoutOptions, true);
                          const { minX, minY, maxX, maxY } = getLayoutBBox(innerLayoutNodes);
                          // move the innerGraph to [0, 0], for later controlled by parent layout
                          const center = { x: (maxX + minX) / 2, y: (maxY + minY) / 2 };
                          innerGraphData.nodes.forEach((node) => {
                              node.data.x -= center.x;
                              node.data.y -= center.y;
                          });
                          const size = [
                              Math.max(maxX - minX, minNodeSize) + padding * 2,
                              Math.max(maxY - minY, minNodeSize) + padding * 2,
                          ];
                          comboNodes.get(treeNode.id).data.size = size;
                          comboNodes.get(treeNode.id).data.nodes = innerLayoutNodes;
                      }));
                  }
                  return true;
              }, 'BT', treeKey);
              innerLayoutPromises.push(start);
          });
          return innerLayoutPromises;
      }
  }
  function executeLayout(layout, graph, options, assign) {
      var _a;
      return __awaiter(this, void 0, void 0, function* () {
          if (isLayoutWithIterations(layout)) {
              layout.execute(graph, options);
              layout.stop();
              return layout.tick((_a = options.iterations) !== null && _a !== void 0 ? _a : 300);
          }
          if (assign)
              return yield layout.assign(graph, options);
          return yield layout.execute(graph, options);
      });
  }

  function forceCenter$1(x, y) {
    var nodes, strength = 1;

    if (x == null) x = 0;
    if (y == null) y = 0;

    function force() {
      var i,
          n = nodes.length,
          node,
          sx = 0,
          sy = 0;

      for (i = 0; i < n; ++i) {
        node = nodes[i], sx += node.x, sy += node.y;
      }

      for (sx = (sx / n - x) * strength, sy = (sy / n - y) * strength, i = 0; i < n; ++i) {
        node = nodes[i], node.x -= sx, node.y -= sy;
      }
    }

    force.initialize = function(_) {
      nodes = _;
    };

    force.x = function(_) {
      return arguments.length ? (x = +_, force) : x;
    };

    force.y = function(_) {
      return arguments.length ? (y = +_, force) : y;
    };

    force.strength = function(_) {
      return arguments.length ? (strength = +_, force) : strength;
    };

    return force;
  }

  function constant$1(x) {
    return function() {
      return x;
    };
  }

  function jiggle$1(random) {
    return (random() - 0.5) * 1e-6;
  }

  function x$3(d) {
    return d.x + d.vx;
  }

  function y$3(d) {
    return d.y + d.vy;
  }

  function forceCollide$1(radius) {
    var nodes,
        radii,
        random,
        strength = 1,
        iterations = 1;

    if (typeof radius !== "function") radius = constant$1(radius == null ? 1 : +radius);

    function force() {
      var i, n = nodes.length,
          tree,
          node,
          xi,
          yi,
          ri,
          ri2;

      for (var k = 0; k < iterations; ++k) {
        tree = quadtree(nodes, x$3, y$3).visitAfter(prepare);
        for (i = 0; i < n; ++i) {
          node = nodes[i];
          ri = radii[node.index], ri2 = ri * ri;
          xi = node.x + node.vx;
          yi = node.y + node.vy;
          tree.visit(apply);
        }
      }

      function apply(quad, x0, y0, x1, y1) {
        var data = quad.data, rj = quad.r, r = ri + rj;
        if (data) {
          if (data.index > node.index) {
            var x = xi - data.x - data.vx,
                y = yi - data.y - data.vy,
                l = x * x + y * y;
            if (l < r * r) {
              if (x === 0) x = jiggle$1(random), l += x * x;
              if (y === 0) y = jiggle$1(random), l += y * y;
              l = (r - (l = Math.sqrt(l))) / l * strength;
              node.vx += (x *= l) * (r = (rj *= rj) / (ri2 + rj));
              node.vy += (y *= l) * r;
              data.vx -= x * (r = 1 - r);
              data.vy -= y * r;
            }
          }
          return;
        }
        return x0 > xi + r || x1 < xi - r || y0 > yi + r || y1 < yi - r;
      }
    }

    function prepare(quad) {
      if (quad.data) return quad.r = radii[quad.data.index];
      for (var i = quad.r = 0; i < 4; ++i) {
        if (quad[i] && quad[i].r > quad.r) {
          quad.r = quad[i].r;
        }
      }
    }

    function initialize() {
      if (!nodes) return;
      var i, n = nodes.length, node;
      radii = new Array(n);
      for (i = 0; i < n; ++i) node = nodes[i], radii[node.index] = +radius(node, i, nodes);
    }

    force.initialize = function(_nodes, _random) {
      nodes = _nodes;
      random = _random;
      initialize();
    };

    force.iterations = function(_) {
      return arguments.length ? (iterations = +_, force) : iterations;
    };

    force.strength = function(_) {
      return arguments.length ? (strength = +_, force) : strength;
    };

    force.radius = function(_) {
      return arguments.length ? (radius = typeof _ === "function" ? _ : constant$1(+_), initialize(), force) : radius;
    };

    return force;
  }

  function index$1(d) {
    return d.index;
  }

  function find$1(nodeById, nodeId) {
    var node = nodeById.get(nodeId);
    if (!node) throw new Error("node not found: " + nodeId);
    return node;
  }

  function forceLink$1(links) {
    var id = index$1,
        strength = defaultStrength,
        strengths,
        distance = constant$1(30),
        distances,
        nodes,
        count,
        bias,
        random,
        iterations = 1;

    if (links == null) links = [];

    function defaultStrength(link) {
      return 1 / Math.min(count[link.source.index], count[link.target.index]);
    }

    function force(alpha) {
      for (var k = 0, n = links.length; k < iterations; ++k) {
        for (var i = 0, link, source, target, x, y, l, b; i < n; ++i) {
          link = links[i], source = link.source, target = link.target;
          x = target.x + target.vx - source.x - source.vx || jiggle$1(random);
          y = target.y + target.vy - source.y - source.vy || jiggle$1(random);
          l = Math.sqrt(x * x + y * y);
          l = (l - distances[i]) / l * alpha * strengths[i];
          x *= l, y *= l;
          target.vx -= x * (b = bias[i]);
          target.vy -= y * b;
          source.vx += x * (b = 1 - b);
          source.vy += y * b;
        }
      }
    }

    function initialize() {
      if (!nodes) return;

      var i,
          n = nodes.length,
          m = links.length,
          nodeById = new Map(nodes.map((d, i) => [id(d, i, nodes), d])),
          link;

      for (i = 0, count = new Array(n); i < m; ++i) {
        link = links[i], link.index = i;
        if (typeof link.source !== "object") link.source = find$1(nodeById, link.source);
        if (typeof link.target !== "object") link.target = find$1(nodeById, link.target);
        count[link.source.index] = (count[link.source.index] || 0) + 1;
        count[link.target.index] = (count[link.target.index] || 0) + 1;
      }

      for (i = 0, bias = new Array(m); i < m; ++i) {
        link = links[i], bias[i] = count[link.source.index] / (count[link.source.index] + count[link.target.index]);
      }

      strengths = new Array(m), initializeStrength();
      distances = new Array(m), initializeDistance();
    }

    function initializeStrength() {
      if (!nodes) return;

      for (var i = 0, n = links.length; i < n; ++i) {
        strengths[i] = +strength(links[i], i, links);
      }
    }

    function initializeDistance() {
      if (!nodes) return;

      for (var i = 0, n = links.length; i < n; ++i) {
        distances[i] = +distance(links[i], i, links);
      }
    }

    force.initialize = function(_nodes, _random) {
      nodes = _nodes;
      random = _random;
      initialize();
    };

    force.links = function(_) {
      return arguments.length ? (links = _, initialize(), force) : links;
    };

    force.id = function(_) {
      return arguments.length ? (id = _, force) : id;
    };

    force.iterations = function(_) {
      return arguments.length ? (iterations = +_, force) : iterations;
    };

    force.strength = function(_) {
      return arguments.length ? (strength = typeof _ === "function" ? _ : constant$1(+_), initializeStrength(), force) : strength;
    };

    force.distance = function(_) {
      return arguments.length ? (distance = typeof _ === "function" ? _ : constant$1(+_), initializeDistance(), force) : distance;
    };

    return force;
  }

  var noop = {value: () => {}};

  function dispatch() {
    for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
      if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
      _[t] = [];
    }
    return new Dispatch(_);
  }

  function Dispatch(_) {
    this._ = _;
  }

  function parseTypenames(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
      return {type: t, name: name};
    });
  }

  Dispatch.prototype = dispatch.prototype = {
    constructor: Dispatch,
    on: function(typename, callback) {
      var _ = this._,
          T = parseTypenames(typename + "", _),
          t,
          i = -1,
          n = T.length;

      // If no callback was specified, return the callback of the given type and name.
      if (arguments.length < 2) {
        while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
        return;
      }

      // If a type was specified, set the callback for the given type and name.
      // Otherwise, if a null callback was specified, remove callbacks of the given name.
      if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
      while (++i < n) {
        if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
        else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
      }

      return this;
    },
    copy: function() {
      var copy = {}, _ = this._;
      for (var t in _) copy[t] = _[t].slice();
      return new Dispatch(copy);
    },
    call: function(type, that) {
      if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    },
    apply: function(type, that, args) {
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    }
  };

  function get(type, name) {
    for (var i = 0, n = type.length, c; i < n; ++i) {
      if ((c = type[i]).name === name) {
        return c.value;
      }
    }
  }

  function set(type, name, callback) {
    for (var i = 0, n = type.length; i < n; ++i) {
      if (type[i].name === name) {
        type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
        break;
      }
    }
    if (callback != null) type.push({name: name, value: callback});
    return type;
  }

  var frame = 0, // is an animation frame pending?
      timeout = 0, // is a timeout pending?
      interval = 0, // are any timers active?
      pokeDelay = 1000, // how frequently we check for clock skew
      taskHead,
      taskTail,
      clockLast = 0,
      clockNow = 0,
      clockSkew = 0,
      clock = typeof performance === "object" && performance.now ? performance : Date,
      setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

  function now() {
    return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
  }

  function clearNow() {
    clockNow = 0;
  }

  function Timer() {
    this._call =
    this._time =
    this._next = null;
  }

  Timer.prototype = timer.prototype = {
    constructor: Timer,
    restart: function(callback, delay, time) {
      if (typeof callback !== "function") throw new TypeError("callback is not a function");
      time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
      if (!this._next && taskTail !== this) {
        if (taskTail) taskTail._next = this;
        else taskHead = this;
        taskTail = this;
      }
      this._call = callback;
      this._time = time;
      sleep();
    },
    stop: function() {
      if (this._call) {
        this._call = null;
        this._time = Infinity;
        sleep();
      }
    }
  };

  function timer(callback, delay, time) {
    var t = new Timer;
    t.restart(callback, delay, time);
    return t;
  }

  function timerFlush() {
    now(); // Get the current time, if not already set.
    ++frame; // Pretend we’ve set an alarm, if we haven’t already.
    var t = taskHead, e;
    while (t) {
      if ((e = clockNow - t._time) >= 0) t._call.call(undefined, e);
      t = t._next;
    }
    --frame;
  }

  function wake() {
    clockNow = (clockLast = clock.now()) + clockSkew;
    frame = timeout = 0;
    try {
      timerFlush();
    } finally {
      frame = 0;
      nap();
      clockNow = 0;
    }
  }

  function poke() {
    var now = clock.now(), delay = now - clockLast;
    if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
  }

  function nap() {
    var t0, t1 = taskHead, t2, time = Infinity;
    while (t1) {
      if (t1._call) {
        if (time > t1._time) time = t1._time;
        t0 = t1, t1 = t1._next;
      } else {
        t2 = t1._next, t1._next = null;
        t1 = t0 ? t0._next = t2 : taskHead = t2;
      }
    }
    taskTail = t0;
    sleep(time);
  }

  function sleep(time) {
    if (frame) return; // Soonest alarm already set, or will be.
    if (timeout) timeout = clearTimeout(timeout);
    var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
    if (delay > 24) {
      if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
      if (interval) interval = clearInterval(interval);
    } else {
      if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
      frame = 1, setFrame(wake);
    }
  }

  // https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
  const a$1 = 1664525;
  const c$1 = 1013904223;
  const m$1 = 4294967296; // 2^32

  function lcg$1() {
    let s = 1;
    return () => (s = (a$1 * s + c$1) % m$1) / m$1;
  }

  function x$2(d) {
    return d.x;
  }

  function y$2(d) {
    return d.y;
  }

  var initialRadius$1 = 10,
      initialAngle = Math.PI * (3 - Math.sqrt(5));

  function forceSimulation$1(nodes) {
    var simulation,
        alpha = 1,
        alphaMin = 0.001,
        alphaDecay = 1 - Math.pow(alphaMin, 1 / 300),
        alphaTarget = 0,
        velocityDecay = 0.6,
        forces = new Map(),
        stepper = timer(step),
        event = dispatch("tick", "end"),
        random = lcg$1();

    if (nodes == null) nodes = [];

    function step() {
      tick();
      event.call("tick", simulation);
      if (alpha < alphaMin) {
        stepper.stop();
        event.call("end", simulation);
      }
    }

    function tick(iterations) {
      var i, n = nodes.length, node;

      if (iterations === undefined) iterations = 1;

      for (var k = 0; k < iterations; ++k) {
        alpha += (alphaTarget - alpha) * alphaDecay;

        forces.forEach(function(force) {
          force(alpha);
        });

        for (i = 0; i < n; ++i) {
          node = nodes[i];
          if (node.fx == null) node.x += node.vx *= velocityDecay;
          else node.x = node.fx, node.vx = 0;
          if (node.fy == null) node.y += node.vy *= velocityDecay;
          else node.y = node.fy, node.vy = 0;
        }
      }

      return simulation;
    }

    function initializeNodes() {
      for (var i = 0, n = nodes.length, node; i < n; ++i) {
        node = nodes[i], node.index = i;
        if (node.fx != null) node.x = node.fx;
        if (node.fy != null) node.y = node.fy;
        if (isNaN(node.x) || isNaN(node.y)) {
          var radius = initialRadius$1 * Math.sqrt(0.5 + i), angle = i * initialAngle;
          node.x = radius * Math.cos(angle);
          node.y = radius * Math.sin(angle);
        }
        if (isNaN(node.vx) || isNaN(node.vy)) {
          node.vx = node.vy = 0;
        }
      }
    }

    function initializeForce(force) {
      if (force.initialize) force.initialize(nodes, random);
      return force;
    }

    initializeNodes();

    return simulation = {
      tick: tick,

      restart: function() {
        return stepper.restart(step), simulation;
      },

      stop: function() {
        return stepper.stop(), simulation;
      },

      nodes: function(_) {
        return arguments.length ? (nodes = _, initializeNodes(), forces.forEach(initializeForce), simulation) : nodes;
      },

      alpha: function(_) {
        return arguments.length ? (alpha = +_, simulation) : alpha;
      },

      alphaMin: function(_) {
        return arguments.length ? (alphaMin = +_, simulation) : alphaMin;
      },

      alphaDecay: function(_) {
        return arguments.length ? (alphaDecay = +_, simulation) : +alphaDecay;
      },

      alphaTarget: function(_) {
        return arguments.length ? (alphaTarget = +_, simulation) : alphaTarget;
      },

      velocityDecay: function(_) {
        return arguments.length ? (velocityDecay = 1 - _, simulation) : 1 - velocityDecay;
      },

      randomSource: function(_) {
        return arguments.length ? (random = _, forces.forEach(initializeForce), simulation) : random;
      },

      force: function(name, _) {
        return arguments.length > 1 ? ((_ == null ? forces.delete(name) : forces.set(name, initializeForce(_))), simulation) : forces.get(name);
      },

      find: function(x, y, radius) {
        var i = 0,
            n = nodes.length,
            dx,
            dy,
            d2,
            node,
            closest;

        if (radius == null) radius = Infinity;
        else radius *= radius;

        for (i = 0; i < n; ++i) {
          node = nodes[i];
          dx = x - node.x;
          dy = y - node.y;
          d2 = dx * dx + dy * dy;
          if (d2 < radius) closest = node, radius = d2;
        }

        return closest;
      },

      on: function(name, _) {
        return arguments.length > 1 ? (event.on(name, _), simulation) : event.on(name);
      }
    };
  }

  function forceManyBody$1() {
    var nodes,
        node,
        random,
        alpha,
        strength = constant$1(-30),
        strengths,
        distanceMin2 = 1,
        distanceMax2 = Infinity,
        theta2 = 0.81;

    function force(_) {
      var i, n = nodes.length, tree = quadtree(nodes, x$2, y$2).visitAfter(accumulate);
      for (alpha = _, i = 0; i < n; ++i) node = nodes[i], tree.visit(apply);
    }

    function initialize() {
      if (!nodes) return;
      var i, n = nodes.length, node;
      strengths = new Array(n);
      for (i = 0; i < n; ++i) node = nodes[i], strengths[node.index] = +strength(node, i, nodes);
    }

    function accumulate(quad) {
      var strength = 0, q, c, weight = 0, x, y, i;

      // For internal nodes, accumulate forces from child quadrants.
      if (quad.length) {
        for (x = y = i = 0; i < 4; ++i) {
          if ((q = quad[i]) && (c = Math.abs(q.value))) {
            strength += q.value, weight += c, x += c * q.x, y += c * q.y;
          }
        }
        quad.x = x / weight;
        quad.y = y / weight;
      }

      // For leaf nodes, accumulate forces from coincident quadrants.
      else {
        q = quad;
        q.x = q.data.x;
        q.y = q.data.y;
        do strength += strengths[q.data.index];
        while (q = q.next);
      }

      quad.value = strength;
    }

    function apply(quad, x1, _, x2) {
      if (!quad.value) return true;

      var x = quad.x - node.x,
          y = quad.y - node.y,
          w = x2 - x1,
          l = x * x + y * y;

      // Apply the Barnes-Hut approximation if possible.
      // Limit forces for very close nodes; randomize direction if coincident.
      if (w * w / theta2 < l) {
        if (l < distanceMax2) {
          if (x === 0) x = jiggle$1(random), l += x * x;
          if (y === 0) y = jiggle$1(random), l += y * y;
          if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
          node.vx += x * quad.value * alpha / l;
          node.vy += y * quad.value * alpha / l;
        }
        return true;
      }

      // Otherwise, process points directly.
      else if (quad.length || l >= distanceMax2) return;

      // Limit forces for very close nodes; randomize direction if coincident.
      if (quad.data !== node || quad.next) {
        if (x === 0) x = jiggle$1(random), l += x * x;
        if (y === 0) y = jiggle$1(random), l += y * y;
        if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
      }

      do if (quad.data !== node) {
        w = strengths[quad.data.index] * alpha / l;
        node.vx += x * w;
        node.vy += y * w;
      } while (quad = quad.next);
    }

    force.initialize = function(_nodes, _random) {
      nodes = _nodes;
      random = _random;
      initialize();
    };

    force.strength = function(_) {
      return arguments.length ? (strength = typeof _ === "function" ? _ : constant$1(+_), initialize(), force) : strength;
    };

    force.distanceMin = function(_) {
      return arguments.length ? (distanceMin2 = _ * _, force) : Math.sqrt(distanceMin2);
    };

    force.distanceMax = function(_) {
      return arguments.length ? (distanceMax2 = _ * _, force) : Math.sqrt(distanceMax2);
    };

    force.theta = function(_) {
      return arguments.length ? (theta2 = _ * _, force) : Math.sqrt(theta2);
    };

    return force;
  }

  function forceRadial$1(radius, x, y) {
    var nodes,
        strength = constant$1(0.1),
        strengths,
        radiuses;

    if (typeof radius !== "function") radius = constant$1(+radius);
    if (x == null) x = 0;
    if (y == null) y = 0;

    function force(alpha) {
      for (var i = 0, n = nodes.length; i < n; ++i) {
        var node = nodes[i],
            dx = node.x - x || 1e-6,
            dy = node.y - y || 1e-6,
            r = Math.sqrt(dx * dx + dy * dy),
            k = (radiuses[i] - r) * strengths[i] * alpha / r;
        node.vx += dx * k;
        node.vy += dy * k;
      }
    }

    function initialize() {
      if (!nodes) return;
      var i, n = nodes.length;
      strengths = new Array(n);
      radiuses = new Array(n);
      for (i = 0; i < n; ++i) {
        radiuses[i] = +radius(nodes[i], i, nodes);
        strengths[i] = isNaN(radiuses[i]) ? 0 : +strength(nodes[i], i, nodes);
      }
    }

    force.initialize = function(_) {
      nodes = _, initialize();
    };

    force.strength = function(_) {
      return arguments.length ? (strength = typeof _ === "function" ? _ : constant$1(+_), initialize(), force) : strength;
    };

    force.radius = function(_) {
      return arguments.length ? (radius = typeof _ === "function" ? _ : constant$1(+_), initialize(), force) : radius;
    };

    force.x = function(_) {
      return arguments.length ? (x = +_, force) : x;
    };

    force.y = function(_) {
      return arguments.length ? (y = +_, force) : y;
    };

    return force;
  }

  function forceX$1(x) {
    var strength = constant$1(0.1),
        nodes,
        strengths,
        xz;

    if (typeof x !== "function") x = constant$1(x == null ? 0 : +x);

    function force(alpha) {
      for (var i = 0, n = nodes.length, node; i < n; ++i) {
        node = nodes[i], node.vx += (xz[i] - node.x) * strengths[i] * alpha;
      }
    }

    function initialize() {
      if (!nodes) return;
      var i, n = nodes.length;
      strengths = new Array(n);
      xz = new Array(n);
      for (i = 0; i < n; ++i) {
        strengths[i] = isNaN(xz[i] = +x(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
      }
    }

    force.initialize = function(_) {
      nodes = _;
      initialize();
    };

    force.strength = function(_) {
      return arguments.length ? (strength = typeof _ === "function" ? _ : constant$1(+_), initialize(), force) : strength;
    };

    force.x = function(_) {
      return arguments.length ? (x = typeof _ === "function" ? _ : constant$1(+_), initialize(), force) : x;
    };

    return force;
  }

  function forceY$1(y) {
    var strength = constant$1(0.1),
        nodes,
        strengths,
        yz;

    if (typeof y !== "function") y = constant$1(y == null ? 0 : +y);

    function force(alpha) {
      for (var i = 0, n = nodes.length, node; i < n; ++i) {
        node = nodes[i], node.vy += (yz[i] - node.y) * strengths[i] * alpha;
      }
    }

    function initialize() {
      if (!nodes) return;
      var i, n = nodes.length;
      strengths = new Array(n);
      yz = new Array(n);
      for (i = 0; i < n; ++i) {
        strengths[i] = isNaN(yz[i] = +y(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
      }
    }

    force.initialize = function(_) {
      nodes = _;
      initialize();
    };

    force.strength = function(_) {
      return arguments.length ? (strength = typeof _ === "function" ? _ : constant$1(+_), initialize(), force) : strength;
    };

    force.y = function(_) {
      return arguments.length ? (y = typeof _ === "function" ? _ : constant$1(+_), initialize(), force) : y;
    };

    return force;
  }

  class D3ForceLayout {
      constructor(options) {
          this.id = 'd3-force';
          this.config = {
              inputNodeAttrs: ['x', 'y', 'vx', 'vy', 'fx', 'fy'],
              outputNodeAttrs: ['x', 'y', 'vx', 'vy'],
              simulationAttrs: [
                  'alpha',
                  'alphaMin',
                  'alphaDecay',
                  'alphaTarget',
                  'velocityDecay',
                  'randomSource',
              ],
          };
          this.forceMap = {
              link: forceLink$1,
              manyBody: forceManyBody$1,
              center: forceCenter$1,
              collide: forceCollide$1,
              radial: forceRadial$1,
              x: forceX$1,
              y: forceY$1,
          };
          // @ts-ignore
          this.options = {
              link: {
                  id: (edge) => edge.id,
              },
              manyBody: {},
              center: {
                  x: 0,
                  y: 0,
              },
          };
          this.context = {
              options: {},
              assign: false,
              nodes: [],
              edges: [],
          };
          deepMix(this.options, options);
          if (this.options.forceSimulation) {
              this.simulation = this.options.forceSimulation;
          }
      }
      execute(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              return this.genericLayout(false, graph, options);
          });
      }
      assign(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              yield this.genericLayout(true, graph, options);
          });
      }
      stop() {
          this.simulation.stop();
      }
      tick(iterations) {
          this.simulation.tick(iterations);
          return this.getResult();
      }
      restart() {
          this.simulation.restart();
      }
      setFixedPosition(id, position) {
          const node = this.context.nodes.find((n) => n.id === id);
          if (!node)
              return;
          position.forEach((value, index) => {
              if (typeof value === 'number' || value === null) {
                  const key = ['fx', 'fy', 'fz'][index];
                  node[key] = value;
              }
          });
      }
      getOptions(options) {
          var _a, _b;
          const _ = deepMix({}, this.options, options);
          // process nodeSize
          if (_.collide && ((_a = _.collide) === null || _a === void 0 ? void 0 : _a.radius) === undefined) {
              _.collide = _.collide || {};
              // @ts-ignore
              _.collide.radius = (_b = _.nodeSize) !== null && _b !== void 0 ? _b : 10;
          }
          // process iterations
          if (_.iterations === undefined) {
              if (_.link && _.link.iterations === undefined) {
                  _.iterations = _.link.iterations;
              }
              if (_.collide && _.collide.iterations === undefined) {
                  _.iterations = _.collide.iterations;
              }
          }
          // assign to context
          this.context.options = _;
          return _;
      }
      genericLayout(assign, graph, options) {
          var _a;
          return __awaiter(this, void 0, void 0, function* () {
              const _options = this.getOptions(options);
              const nodes = graph.getAllNodes().map(({ id, data }) => (Object.assign(Object.assign({ id }, data), pick(data.data, this.config.inputNodeAttrs))));
              const edges = graph.getAllEdges().map((edge) => (Object.assign({}, edge)));
              Object.assign(this.context, { assign, nodes, edges, graph });
              const promise = new Promise((resolver) => {
                  this.resolver = resolver;
              });
              const simulation = this.setSimulation(_options);
              simulation.nodes(nodes);
              (_a = simulation.force('link')) === null || _a === void 0 ? void 0 : _a.links(edges);
              return promise;
          });
      }
      getResult() {
          const { assign, nodes, edges, graph } = this.context;
          const nodesResult = nodes.map((node) => ({
              id: node.id,
              data: Object.assign(Object.assign({}, node.data), pick(node, this.config.outputNodeAttrs)),
          }));
          const edgeResult = edges.map(({ id, source, target, data }) => ({
              id,
              source: typeof source === 'object' ? source.id : source,
              target: typeof target === 'object' ? target.id : target,
              data,
          }));
          if (assign) {
              nodesResult.forEach((node) => graph.mergeNodeData(node.id, node.data));
          }
          return { nodes: nodesResult, edges: edgeResult };
      }
      initSimulation() {
          return forceSimulation$1();
      }
      setSimulation(options) {
          const simulation = this.simulation || this.options.forceSimulation || this.initSimulation();
          if (!this.simulation) {
              this.simulation = simulation
                  .on('tick', () => { var _a; return (_a = options.onTick) === null || _a === void 0 ? void 0 : _a.call(options, this.getResult()); })
                  .on('end', () => { var _a; return (_a = this.resolver) === null || _a === void 0 ? void 0 : _a.call(this, this.getResult()); });
          }
          apply(simulation, this.config.simulationAttrs.map((name) => [
              name,
              options[name],
          ]));
          Object.entries(this.forceMap).forEach(([name, Ctor]) => {
              const forceName = name;
              if (options[name]) {
                  let force = simulation.force(forceName);
                  if (!force) {
                      force = Ctor();
                      simulation.force(forceName, force);
                  }
                  apply(force, Object.entries(options[forceName]));
              }
              else
                  simulation.force(forceName, null);
          });
          return simulation;
      }
  }
  const apply = (target, params) => {
      return params.reduce((acc, [method, param]) => {
          if (!acc[method] || param === undefined)
              return acc;
          return acc[method].call(target, param);
      }, target);
  };

  function forceCenter(x, y, z) {
    var nodes, strength = 1;

    if (x == null) x = 0;
    if (y == null) y = 0;
    if (z == null) z = 0;

    function force() {
      var i,
          n = nodes.length,
          node,
          sx = 0,
          sy = 0,
          sz = 0;

      for (i = 0; i < n; ++i) {
        node = nodes[i], sx += node.x || 0, sy += node.y || 0, sz += node.z || 0;
      }

      for (sx = (sx / n - x) * strength, sy = (sy / n - y) * strength, sz = (sz / n - z) * strength, i = 0; i < n; ++i) {
        node = nodes[i];
        if (sx) { node.x -= sx; }
        if (sy) { node.y -= sy; }
        if (sz) { node.z -= sz; }
      }
    }

    force.initialize = function(_) {
      nodes = _;
    };

    force.x = function(_) {
      return arguments.length ? (x = +_, force) : x;
    };

    force.y = function(_) {
      return arguments.length ? (y = +_, force) : y;
    };

    force.z = function(_) {
      return arguments.length ? (z = +_, force) : z;
    };

    force.strength = function(_) {
      return arguments.length ? (strength = +_, force) : strength;
    };

    return force;
  }

  function tree_add(d) {
    const x = +this._x.call(null, d);
    return add(this.cover(x), x, d);
  }

  function add(tree, x, d) {
    if (isNaN(x)) return tree; // ignore invalid points

    var parent,
        node = tree._root,
        leaf = {data: d},
        x0 = tree._x0,
        x1 = tree._x1,
        xm,
        xp,
        right,
        i,
        j;

    // If the tree is empty, initialize the root as a leaf.
    if (!node) return tree._root = leaf, tree;

    // Find the existing leaf for the new point, or add it.
    while (node.length) {
      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
      if (parent = node, !(node = node[i = +right])) return parent[i] = leaf, tree;
    }

    // Is the new point is exactly coincident with the existing point?
    xp = +tree._x.call(null, node.data);
    if (x === xp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;

    // Otherwise, split the leaf node until the old and new point are separated.
    do {
      parent = parent ? parent[i] = new Array(2) : tree._root = new Array(2);
      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
    } while ((i = +right) === (j = +(xp >= xm)));
    return parent[j] = node, parent[i] = leaf, tree;
  }

  function addAll(data) {
    if (!Array.isArray(data)) data = Array.from(data);
    const n = data.length;
    const xz = new Float64Array(n);
    let x0 = Infinity,
        x1 = -Infinity;

    // Compute the points and their extent.
    for (let i = 0, x; i < n; ++i) {
      if (isNaN(x = +this._x.call(null, data[i]))) continue;
      xz[i] = x;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
    }

    // If there were no (valid) points, abort.
    if (x0 > x1) return this;

    // Expand the tree to cover the new points.
    this.cover(x0).cover(x1);

    // Add the new points.
    for (let i = 0; i < n; ++i) {
      add(this, xz[i], data[i]);
    }

    return this;
  }

  function tree_cover(x) {
    if (isNaN(x = +x)) return this; // ignore invalid points

    var x0 = this._x0,
        x1 = this._x1;

    // If the binarytree has no extent, initialize them.
    // Integer extent are necessary so that if we later double the extent,
    // the existing half boundaries don’t change due to floating point error!
    if (isNaN(x0)) {
      x1 = (x0 = Math.floor(x)) + 1;
    }

    // Otherwise, double repeatedly to cover.
    else {
      var z = x1 - x0 || 1,
          node = this._root,
          parent,
          i;

      while (x0 > x || x >= x1) {
        i = +(x < x0);
        parent = new Array(2), parent[i] = node, node = parent, z *= 2;
        switch (i) {
          case 0: x1 = x0 + z; break;
          case 1: x0 = x1 - z; break;
        }
      }

      if (this._root && this._root.length) this._root = node;
    }

    this._x0 = x0;
    this._x1 = x1;
    return this;
  }

  function tree_data() {
    var data = [];
    this.visit(function(node) {
      if (!node.length) do data.push(node.data); while (node = node.next)
    });
    return data;
  }

  function tree_extent(_) {
    return arguments.length
        ? this.cover(+_[0][0]).cover(+_[1][0])
        : isNaN(this._x0) ? undefined : [[this._x0], [this._x1]];
  }

  function Half(node, x0, x1) {
    this.node = node;
    this.x0 = x0;
    this.x1 = x1;
  }

  function tree_find(x, radius) {
    var data,
        x0 = this._x0,
        x1,
        x2,
        x3 = this._x1,
        halves = [],
        node = this._root,
        q,
        i;

    if (node) halves.push(new Half(node, x0, x3));
    if (radius == null) radius = Infinity;
    else {
      x0 = x - radius;
      x3 = x + radius;
    }

    while (q = halves.pop()) {

      // Stop searching if this half can’t contain a closer node.
      if (!(node = q.node)
          || (x1 = q.x0) > x3
          || (x2 = q.x1) < x0) continue;

      // Bisect the current half.
      if (node.length) {
        var xm = (x1 + x2) / 2;

        halves.push(
          new Half(node[1], xm, x2),
          new Half(node[0], x1, xm)
        );

        // Visit the closest half first.
        if (i = +(x >= xm)) {
          q = halves[halves.length - 1];
          halves[halves.length - 1] = halves[halves.length - 1 - i];
          halves[halves.length - 1 - i] = q;
        }
      }

      // Visit this point. (Visiting coincident points isn’t necessary!)
      else {
        var d = Math.abs(x - +this._x.call(null, node.data));
        if (d < radius) {
          radius = d;
          x0 = x - d;
          x3 = x + d;
          data = node.data;
        }
      }
    }

    return data;
  }

  function tree_remove(d) {
    if (isNaN(x = +this._x.call(null, d))) return this; // ignore invalid points

    var parent,
        node = this._root,
        retainer,
        previous,
        next,
        x0 = this._x0,
        x1 = this._x1,
        x,
        xm,
        right,
        i,
        j;

    // If the tree is empty, initialize the root as a leaf.
    if (!node) return this;

    // Find the leaf node for the point.
    // While descending, also retain the deepest parent with a non-removed sibling.
    if (node.length) while (true) {
      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
      if (!(parent = node, node = node[i = +right])) return this;
      if (!node.length) break;
      if (parent[(i + 1) & 1]) retainer = parent, j = i;
    }

    // Find the point to remove.
    while (node.data !== d) if (!(previous = node, node = node.next)) return this;
    if (next = node.next) delete node.next;

    // If there are multiple coincident points, remove just the point.
    if (previous) return (next ? previous.next = next : delete previous.next), this;

    // If this is the root point, remove it.
    if (!parent) return this._root = next, this;

    // Remove this leaf.
    next ? parent[i] = next : delete parent[i];

    // If the parent now contains exactly one leaf, collapse superfluous parents.
    if ((node = parent[0] || parent[1])
        && node === (parent[1] || parent[0])
        && !node.length) {
      if (retainer) retainer[j] = node;
      else this._root = node;
    }

    return this;
  }

  function removeAll(data) {
    for (var i = 0, n = data.length; i < n; ++i) this.remove(data[i]);
    return this;
  }

  function tree_root() {
    return this._root;
  }

  function tree_size() {
    var size = 0;
    this.visit(function(node) {
      if (!node.length) do ++size; while (node = node.next)
    });
    return size;
  }

  function tree_visit(callback) {
    var halves = [], q, node = this._root, child, x0, x1;
    if (node) halves.push(new Half(node, this._x0, this._x1));
    while (q = halves.pop()) {
      if (!callback(node = q.node, x0 = q.x0, x1 = q.x1) && node.length) {
        var xm = (x0 + x1) / 2;
        if (child = node[1]) halves.push(new Half(child, xm, x1));
        if (child = node[0]) halves.push(new Half(child, x0, xm));
      }
    }
    return this;
  }

  function tree_visitAfter(callback) {
    var halves = [], next = [], q;
    if (this._root) halves.push(new Half(this._root, this._x0, this._x1));
    while (q = halves.pop()) {
      var node = q.node;
      if (node.length) {
        var child, x0 = q.x0, x1 = q.x1, xm = (x0 + x1) / 2;
        if (child = node[0]) halves.push(new Half(child, x0, xm));
        if (child = node[1]) halves.push(new Half(child, xm, x1));
      }
      next.push(q);
    }
    while (q = next.pop()) {
      callback(q.node, q.x0, q.x1);
    }
    return this;
  }

  function defaultX(d) {
    return d[0];
  }

  function tree_x(_) {
    return arguments.length ? (this._x = _, this) : this._x;
  }

  function binarytree(nodes, x) {
    var tree = new Binarytree(x == null ? defaultX : x, NaN, NaN);
    return nodes == null ? tree : tree.addAll(nodes);
  }

  function Binarytree(x, x0, x1) {
    this._x = x;
    this._x0 = x0;
    this._x1 = x1;
    this._root = undefined;
  }

  function leaf_copy(leaf) {
    var copy = {data: leaf.data}, next = copy;
    while (leaf = leaf.next) next = next.next = {data: leaf.data};
    return copy;
  }

  var treeProto = binarytree.prototype = Binarytree.prototype;

  treeProto.copy = function() {
    var copy = new Binarytree(this._x, this._x0, this._x1),
        node = this._root,
        nodes,
        child;

    if (!node) return copy;

    if (!node.length) return copy._root = leaf_copy(node), copy;

    nodes = [{source: node, target: copy._root = new Array(2)}];
    while (node = nodes.pop()) {
      for (var i = 0; i < 2; ++i) {
        if (child = node.source[i]) {
          if (child.length) nodes.push({source: child, target: node.target[i] = new Array(2)});
          else node.target[i] = leaf_copy(child);
        }
      }
    }

    return copy;
  };

  treeProto.add = tree_add;
  treeProto.addAll = addAll;
  treeProto.cover = tree_cover;
  treeProto.data = tree_data;
  treeProto.extent = tree_extent;
  treeProto.find = tree_find;
  treeProto.remove = tree_remove;
  treeProto.removeAll = removeAll;
  treeProto.root = tree_root;
  treeProto.size = tree_size;
  treeProto.visit = tree_visit;
  treeProto.visitAfter = tree_visitAfter;
  treeProto.x = tree_x;

  function constant(x) {
    return function() {
      return x;
    };
  }

  function jiggle(random) {
    return (random() - 0.5) * 1e-6;
  }

  function x$1(d) {
    return d.x + d.vx;
  }

  function y$1(d) {
    return d.y + d.vy;
  }

  function z$1(d) {
    return d.z + d.vz;
  }

  function forceCollide(radius) {
    var nodes,
        nDim,
        radii,
        random,
        strength = 1,
        iterations = 1;

    if (typeof radius !== "function") radius = constant(radius == null ? 1 : +radius);

    function force() {
      var i, n = nodes.length,
          tree,
          node,
          xi,
          yi,
          zi,
          ri,
          ri2;

      for (var k = 0; k < iterations; ++k) {
        tree =
            (nDim === 1 ? binarytree(nodes, x$1)
            :(nDim === 2 ? quadtree(nodes, x$1, y$1)
            :(nDim === 3 ? octree(nodes, x$1, y$1, z$1)
            :null
        ))).visitAfter(prepare);

        for (i = 0; i < n; ++i) {
          node = nodes[i];
          ri = radii[node.index], ri2 = ri * ri;
          xi = node.x + node.vx;
          if (nDim > 1) { yi = node.y + node.vy; }
          if (nDim > 2) { zi = node.z + node.vz; }
          tree.visit(apply);
        }
      }

      function apply(treeNode, arg1, arg2, arg3, arg4, arg5, arg6) {
        var args = [arg1, arg2, arg3, arg4, arg5, arg6];
        var x0 = args[0],
            y0 = args[1],
            z0 = args[2],
            x1 = args[nDim],
            y1 = args[nDim+1],
            z1 = args[nDim+2];

        var data = treeNode.data, rj = treeNode.r, r = ri + rj;
        if (data) {
          if (data.index > node.index) {
            var x = xi - data.x - data.vx,
                y = (nDim > 1 ? yi - data.y - data.vy : 0),
                z = (nDim > 2 ? zi - data.z - data.vz : 0),
                l = x * x + y * y + z * z;
            if (l < r * r) {
              if (x === 0) x = jiggle(random), l += x * x;
              if (nDim > 1 && y === 0) y = jiggle(random), l += y * y;
              if (nDim > 2 && z === 0) z = jiggle(random), l += z * z;
              l = (r - (l = Math.sqrt(l))) / l * strength;

              node.vx += (x *= l) * (r = (rj *= rj) / (ri2 + rj));
              if (nDim > 1) { node.vy += (y *= l) * r; }
              if (nDim > 2) { node.vz += (z *= l) * r; }

              data.vx -= x * (r = 1 - r);
              if (nDim > 1) { data.vy -= y * r; }
              if (nDim > 2) { data.vz -= z * r; }
            }
          }
          return;
        }
        return x0 > xi + r || x1 < xi - r
            || (nDim > 1 && (y0 > yi + r || y1 < yi - r))
            || (nDim > 2 && (z0 > zi + r || z1 < zi - r));
      }
    }

    function prepare(treeNode) {
      if (treeNode.data) return treeNode.r = radii[treeNode.data.index];
      for (var i = treeNode.r = 0; i < Math.pow(2, nDim); ++i) {
        if (treeNode[i] && treeNode[i].r > treeNode.r) {
          treeNode.r = treeNode[i].r;
        }
      }
    }

    function initialize() {
      if (!nodes) return;
      var i, n = nodes.length, node;
      radii = new Array(n);
      for (i = 0; i < n; ++i) node = nodes[i], radii[node.index] = +radius(node, i, nodes);
    }

    force.initialize = function(_nodes, ...args) {
      nodes = _nodes;
      random = args.find(arg => typeof arg === 'function') || Math.random;
      nDim = args.find(arg => [1, 2, 3].includes(arg)) || 2;
      initialize();
    };

    force.iterations = function(_) {
      return arguments.length ? (iterations = +_, force) : iterations;
    };

    force.strength = function(_) {
      return arguments.length ? (strength = +_, force) : strength;
    };

    force.radius = function(_) {
      return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), initialize(), force) : radius;
    };

    return force;
  }

  function index(d) {
    return d.index;
  }

  function find(nodeById, nodeId) {
    var node = nodeById.get(nodeId);
    if (!node) throw new Error("node not found: " + nodeId);
    return node;
  }

  function forceLink(links) {
    var id = index,
        strength = defaultStrength,
        strengths,
        distance = constant(30),
        distances,
        nodes,
        nDim,
        count,
        bias,
        random,
        iterations = 1;

    if (links == null) links = [];

    function defaultStrength(link) {
      return 1 / Math.min(count[link.source.index], count[link.target.index]);
    }

    function force(alpha) {
      for (var k = 0, n = links.length; k < iterations; ++k) {
        for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
          link = links[i], source = link.source, target = link.target;
          x = target.x + target.vx - source.x - source.vx || jiggle(random);
          if (nDim > 1) { y = target.y + target.vy - source.y - source.vy || jiggle(random); }
          if (nDim > 2) { z = target.z + target.vz - source.z - source.vz || jiggle(random); }
          l = Math.sqrt(x * x + y * y + z * z);
          l = (l - distances[i]) / l * alpha * strengths[i];
          x *= l, y *= l, z *= l;

          target.vx -= x * (b = bias[i]);
          if (nDim > 1) { target.vy -= y * b; }
          if (nDim > 2) { target.vz -= z * b; }

          source.vx += x * (b = 1 - b);
          if (nDim > 1) { source.vy += y * b; }
          if (nDim > 2) { source.vz += z * b; }
        }
      }
    }

    function initialize() {
      if (!nodes) return;

      var i,
          n = nodes.length,
          m = links.length,
          nodeById = new Map(nodes.map((d, i) => [id(d, i, nodes), d])),
          link;

      for (i = 0, count = new Array(n); i < m; ++i) {
        link = links[i], link.index = i;
        if (typeof link.source !== "object") link.source = find(nodeById, link.source);
        if (typeof link.target !== "object") link.target = find(nodeById, link.target);
        count[link.source.index] = (count[link.source.index] || 0) + 1;
        count[link.target.index] = (count[link.target.index] || 0) + 1;
      }

      for (i = 0, bias = new Array(m); i < m; ++i) {
        link = links[i], bias[i] = count[link.source.index] / (count[link.source.index] + count[link.target.index]);
      }

      strengths = new Array(m), initializeStrength();
      distances = new Array(m), initializeDistance();
    }

    function initializeStrength() {
      if (!nodes) return;

      for (var i = 0, n = links.length; i < n; ++i) {
        strengths[i] = +strength(links[i], i, links);
      }
    }

    function initializeDistance() {
      if (!nodes) return;

      for (var i = 0, n = links.length; i < n; ++i) {
        distances[i] = +distance(links[i], i, links);
      }
    }

    force.initialize = function(_nodes, ...args) {
      nodes = _nodes;
      random = args.find(arg => typeof arg === 'function') || Math.random;
      nDim = args.find(arg => [1, 2, 3].includes(arg)) || 2;
      initialize();
    };

    force.links = function(_) {
      return arguments.length ? (links = _, initialize(), force) : links;
    };

    force.id = function(_) {
      return arguments.length ? (id = _, force) : id;
    };

    force.iterations = function(_) {
      return arguments.length ? (iterations = +_, force) : iterations;
    };

    force.strength = function(_) {
      return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initializeStrength(), force) : strength;
    };

    force.distance = function(_) {
      return arguments.length ? (distance = typeof _ === "function" ? _ : constant(+_), initializeDistance(), force) : distance;
    };

    return force;
  }

  // https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
  const a = 1664525;
  const c = 1013904223;
  const m = 4294967296; // 2^32

  function lcg() {
    let s = 1;
    return () => (s = (a * s + c) % m) / m;
  }

  var MAX_DIMENSIONS = 3;

  function x(d) {
    return d.x;
  }

  function y(d) {
    return d.y;
  }

  function z(d) {
    return d.z;
  }

  var initialRadius = 10,
      initialAngleRoll = Math.PI * (3 - Math.sqrt(5)), // Golden ratio angle
      initialAngleYaw = Math.PI * 20 / (9 + Math.sqrt(221)); // Markov irrational number

  function forceSimulation(nodes, numDimensions) {
    numDimensions = numDimensions || 2;

    var nDim = Math.min(MAX_DIMENSIONS, Math.max(1, Math.round(numDimensions))),
        simulation,
        alpha = 1,
        alphaMin = 0.001,
        alphaDecay = 1 - Math.pow(alphaMin, 1 / 300),
        alphaTarget = 0,
        velocityDecay = 0.6,
        forces = new Map(),
        stepper = timer(step),
        event = dispatch("tick", "end"),
        random = lcg();

    if (nodes == null) nodes = [];

    function step() {
      tick();
      event.call("tick", simulation);
      if (alpha < alphaMin) {
        stepper.stop();
        event.call("end", simulation);
      }
    }

    function tick(iterations) {
      var i, n = nodes.length, node;

      if (iterations === undefined) iterations = 1;

      for (var k = 0; k < iterations; ++k) {
        alpha += (alphaTarget - alpha) * alphaDecay;

        forces.forEach(function (force) {
          force(alpha);
        });

        for (i = 0; i < n; ++i) {
          node = nodes[i];
          if (node.fx == null) node.x += node.vx *= velocityDecay;
          else node.x = node.fx, node.vx = 0;
          if (nDim > 1) {
            if (node.fy == null) node.y += node.vy *= velocityDecay;
            else node.y = node.fy, node.vy = 0;
          }
          if (nDim > 2) {
            if (node.fz == null) node.z += node.vz *= velocityDecay;
            else node.z = node.fz, node.vz = 0;
          }
        }
      }

      return simulation;
    }

    function initializeNodes() {
      for (var i = 0, n = nodes.length, node; i < n; ++i) {
        node = nodes[i], node.index = i;
        if (node.fx != null) node.x = node.fx;
        if (node.fy != null) node.y = node.fy;
        if (node.fz != null) node.z = node.fz;
        if (isNaN(node.x) || (nDim > 1 && isNaN(node.y)) || (nDim > 2 && isNaN(node.z))) {
          var radius = initialRadius * (nDim > 2 ? Math.cbrt(0.5 + i) : (nDim > 1 ? Math.sqrt(0.5 + i) : i)),
            rollAngle = i * initialAngleRoll,
            yawAngle = i * initialAngleYaw;

          if (nDim === 1) {
            node.x = radius;
          } else if (nDim === 2) {
            node.x = radius * Math.cos(rollAngle);
            node.y = radius * Math.sin(rollAngle);
          } else { // 3 dimensions: use spherical distribution along 2 irrational number angles
            node.x = radius * Math.sin(rollAngle) * Math.cos(yawAngle);
            node.y = radius * Math.cos(rollAngle);
            node.z = radius * Math.sin(rollAngle) * Math.sin(yawAngle);
          }
        }
        if (isNaN(node.vx) || (nDim > 1 && isNaN(node.vy)) || (nDim > 2 && isNaN(node.vz))) {
          node.vx = 0;
          if (nDim > 1) { node.vy = 0; }
          if (nDim > 2) { node.vz = 0; }
        }
      }
    }

    function initializeForce(force) {
      if (force.initialize) force.initialize(nodes, random, nDim);
      return force;
    }

    initializeNodes();

    return simulation = {
      tick: tick,

      restart: function() {
        return stepper.restart(step), simulation;
      },

      stop: function() {
        return stepper.stop(), simulation;
      },

      numDimensions: function(_) {
        return arguments.length
            ? (nDim = Math.min(MAX_DIMENSIONS, Math.max(1, Math.round(_))), forces.forEach(initializeForce), simulation)
            : nDim;
      },

      nodes: function(_) {
        return arguments.length ? (nodes = _, initializeNodes(), forces.forEach(initializeForce), simulation) : nodes;
      },

      alpha: function(_) {
        return arguments.length ? (alpha = +_, simulation) : alpha;
      },

      alphaMin: function(_) {
        return arguments.length ? (alphaMin = +_, simulation) : alphaMin;
      },

      alphaDecay: function(_) {
        return arguments.length ? (alphaDecay = +_, simulation) : +alphaDecay;
      },

      alphaTarget: function(_) {
        return arguments.length ? (alphaTarget = +_, simulation) : alphaTarget;
      },

      velocityDecay: function(_) {
        return arguments.length ? (velocityDecay = 1 - _, simulation) : 1 - velocityDecay;
      },

      randomSource: function(_) {
        return arguments.length ? (random = _, forces.forEach(initializeForce), simulation) : random;
      },

      force: function(name, _) {
        return arguments.length > 1 ? ((_ == null ? forces.delete(name) : forces.set(name, initializeForce(_))), simulation) : forces.get(name);
      },

      find: function() {
        var args = Array.prototype.slice.call(arguments);
        var x = args.shift() || 0,
            y = (nDim > 1 ? args.shift() : null) || 0,
            z = (nDim > 2 ? args.shift() : null) || 0,
            radius = args.shift() || Infinity;

        var i = 0,
            n = nodes.length,
            dx,
            dy,
            dz,
            d2,
            node,
            closest;

        radius *= radius;

        for (i = 0; i < n; ++i) {
          node = nodes[i];
          dx = x - node.x;
          dy = y - (node.y || 0);
          dz = z - (node.z ||0);
          d2 = dx * dx + dy * dy + dz * dz;
          if (d2 < radius) closest = node, radius = d2;
        }

        return closest;
      },

      on: function(name, _) {
        return arguments.length > 1 ? (event.on(name, _), simulation) : event.on(name);
      }
    };
  }

  function forceManyBody() {
    var nodes,
        nDim,
        node,
        random,
        alpha,
        strength = constant(-30),
        strengths,
        distanceMin2 = 1,
        distanceMax2 = Infinity,
        theta2 = 0.81;

    function force(_) {
      var i,
          n = nodes.length,
          tree =
              (nDim === 1 ? binarytree(nodes, x)
              :(nDim === 2 ? quadtree(nodes, x, y)
              :(nDim === 3 ? octree(nodes, x, y, z)
              :null
          ))).visitAfter(accumulate);

      for (alpha = _, i = 0; i < n; ++i) node = nodes[i], tree.visit(apply);
    }

    function initialize() {
      if (!nodes) return;
      var i, n = nodes.length, node;
      strengths = new Array(n);
      for (i = 0; i < n; ++i) node = nodes[i], strengths[node.index] = +strength(node, i, nodes);
    }

    function accumulate(treeNode) {
      var strength = 0, q, c, weight = 0, x, y, z, i;
      var numChildren = treeNode.length;

      // For internal nodes, accumulate forces from children.
      if (numChildren) {
        for (x = y = z = i = 0; i < numChildren; ++i) {
          if ((q = treeNode[i]) && (c = Math.abs(q.value))) {
            strength += q.value, weight += c, x += c * (q.x || 0), y += c * (q.y || 0), z += c * (q.z || 0);
          }
        }
        strength *= Math.sqrt(4 / numChildren); // scale accumulated strength according to number of dimensions

        treeNode.x = x / weight;
        if (nDim > 1) { treeNode.y = y / weight; }
        if (nDim > 2) { treeNode.z = z / weight; }
      }

      // For leaf nodes, accumulate forces from coincident nodes.
      else {
        q = treeNode;
        q.x = q.data.x;
        if (nDim > 1) { q.y = q.data.y; }
        if (nDim > 2) { q.z = q.data.z; }
        do strength += strengths[q.data.index];
        while (q = q.next);
      }

      treeNode.value = strength;
    }

    function apply(treeNode, x1, arg1, arg2, arg3) {
      if (!treeNode.value) return true;
      var x2 = [arg1, arg2, arg3][nDim-1];

      var x = treeNode.x - node.x,
          y = (nDim > 1 ? treeNode.y - node.y : 0),
          z = (nDim > 2 ? treeNode.z - node.z : 0),
          w = x2 - x1,
          l = x * x + y * y + z * z;

      // Apply the Barnes-Hut approximation if possible.
      // Limit forces for very close nodes; randomize direction if coincident.
      if (w * w / theta2 < l) {
        if (l < distanceMax2) {
          if (x === 0) x = jiggle(random), l += x * x;
          if (nDim > 1 && y === 0) y = jiggle(random), l += y * y;
          if (nDim > 2 && z === 0) z = jiggle(random), l += z * z;
          if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
          node.vx += x * treeNode.value * alpha / l;
          if (nDim > 1) { node.vy += y * treeNode.value * alpha / l; }
          if (nDim > 2) { node.vz += z * treeNode.value * alpha / l; }
        }
        return true;
      }

      // Otherwise, process points directly.
      else if (treeNode.length || l >= distanceMax2) return;

      // Limit forces for very close nodes; randomize direction if coincident.
      if (treeNode.data !== node || treeNode.next) {
        if (x === 0) x = jiggle(random), l += x * x;
        if (nDim > 1 && y === 0) y = jiggle(random), l += y * y;
        if (nDim > 2 && z === 0) z = jiggle(random), l += z * z;
        if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
      }

      do if (treeNode.data !== node) {
        w = strengths[treeNode.data.index] * alpha / l;
        node.vx += x * w;
        if (nDim > 1) { node.vy += y * w; }
        if (nDim > 2) { node.vz += z * w; }
      } while (treeNode = treeNode.next);
    }

    force.initialize = function(_nodes, ...args) {
      nodes = _nodes;
      random = args.find(arg => typeof arg === 'function') || Math.random;
      nDim = args.find(arg => [1, 2, 3].includes(arg)) || 2;
      initialize();
    };

    force.strength = function(_) {
      return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
    };

    force.distanceMin = function(_) {
      return arguments.length ? (distanceMin2 = _ * _, force) : Math.sqrt(distanceMin2);
    };

    force.distanceMax = function(_) {
      return arguments.length ? (distanceMax2 = _ * _, force) : Math.sqrt(distanceMax2);
    };

    force.theta = function(_) {
      return arguments.length ? (theta2 = _ * _, force) : Math.sqrt(theta2);
    };

    return force;
  }

  function forceRadial(radius, x, y, z) {
    var nodes,
        nDim,
        strength = constant(0.1),
        strengths,
        radiuses;

    if (typeof radius !== "function") radius = constant(+radius);
    if (x == null) x = 0;
    if (y == null) y = 0;
    if (z == null) z = 0;

    function force(alpha) {
      for (var i = 0, n = nodes.length; i < n; ++i) {
        var node = nodes[i],
            dx = node.x - x || 1e-6,
            dy = (node.y || 0) - y || 1e-6,
            dz = (node.z || 0) - z || 1e-6,
            r = Math.sqrt(dx * dx + dy * dy + dz * dz),
            k = (radiuses[i] - r) * strengths[i] * alpha / r;
        node.vx += dx * k;
        if (nDim>1) { node.vy += dy * k; }
        if (nDim>2) { node.vz += dz * k; }
      }
    }

    function initialize() {
      if (!nodes) return;
      var i, n = nodes.length;
      strengths = new Array(n);
      radiuses = new Array(n);
      for (i = 0; i < n; ++i) {
        radiuses[i] = +radius(nodes[i], i, nodes);
        strengths[i] = isNaN(radiuses[i]) ? 0 : +strength(nodes[i], i, nodes);
      }
    }

    force.initialize = function(initNodes, ...args) {
      nodes = initNodes;
      nDim = args.find(arg => [1, 2, 3].includes(arg)) || 2;
      initialize();
    };

    force.strength = function(_) {
      return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
    };

    force.radius = function(_) {
      return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), initialize(), force) : radius;
    };

    force.x = function(_) {
      return arguments.length ? (x = +_, force) : x;
    };

    force.y = function(_) {
      return arguments.length ? (y = +_, force) : y;
    };

    force.z = function(_) {
      return arguments.length ? (z = +_, force) : z;
    };

    return force;
  }

  function forceX(x) {
    var strength = constant(0.1),
        nodes,
        strengths,
        xz;

    if (typeof x !== "function") x = constant(x == null ? 0 : +x);

    function force(alpha) {
      for (var i = 0, n = nodes.length, node; i < n; ++i) {
        node = nodes[i], node.vx += (xz[i] - node.x) * strengths[i] * alpha;
      }
    }

    function initialize() {
      if (!nodes) return;
      var i, n = nodes.length;
      strengths = new Array(n);
      xz = new Array(n);
      for (i = 0; i < n; ++i) {
        strengths[i] = isNaN(xz[i] = +x(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
      }
    }

    force.initialize = function(_) {
      nodes = _;
      initialize();
    };

    force.strength = function(_) {
      return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
    };

    force.x = function(_) {
      return arguments.length ? (x = typeof _ === "function" ? _ : constant(+_), initialize(), force) : x;
    };

    return force;
  }

  function forceY(y) {
    var strength = constant(0.1),
        nodes,
        strengths,
        yz;

    if (typeof y !== "function") y = constant(y == null ? 0 : +y);

    function force(alpha) {
      for (var i = 0, n = nodes.length, node; i < n; ++i) {
        node = nodes[i], node.vy += (yz[i] - node.y) * strengths[i] * alpha;
      }
    }

    function initialize() {
      if (!nodes) return;
      var i, n = nodes.length;
      strengths = new Array(n);
      yz = new Array(n);
      for (i = 0; i < n; ++i) {
        strengths[i] = isNaN(yz[i] = +y(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
      }
    }

    force.initialize = function(_) {
      nodes = _;
      initialize();
    };

    force.strength = function(_) {
      return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
    };

    force.y = function(_) {
      return arguments.length ? (y = typeof _ === "function" ? _ : constant(+_), initialize(), force) : y;
    };

    return force;
  }

  function forceZ(z) {
    var strength = constant(0.1),
        nodes,
        strengths,
        zz;

    if (typeof z !== "function") z = constant(z == null ? 0 : +z);

    function force(alpha) {
      for (var i = 0, n = nodes.length, node; i < n; ++i) {
        node = nodes[i], node.vz += (zz[i] - node.z) * strengths[i] * alpha;
      }
    }

    function initialize() {
      if (!nodes) return;
      var i, n = nodes.length;
      strengths = new Array(n);
      zz = new Array(n);
      for (i = 0; i < n; ++i) {
        strengths[i] = isNaN(zz[i] = +z(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
      }
    }

    force.initialize = function(_) {
      nodes = _;
      initialize();
    };

    force.strength = function(_) {
      return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
    };

    force.z = function(_) {
      return arguments.length ? (z = typeof _ === "function" ? _ : constant(+_), initialize(), force) : z;
    };

    return force;
  }

  class D3Force3DLayout extends D3ForceLayout {
      constructor() {
          super(...arguments);
          this.id = 'd3-force-3d';
          this.config = {
              inputNodeAttrs: ['x', 'y', 'z', 'vx', 'vy', 'vz', 'fx', 'fy', 'fz'],
              outputNodeAttrs: ['x', 'y', 'z', 'vx', 'vy', 'vz'],
              simulationAttrs: [
                  'alpha',
                  'alphaMin',
                  'alphaDecay',
                  'alphaTarget',
                  'velocityDecay',
                  'randomSource',
                  'numDimensions',
              ],
          };
          this.forceMap = {
              link: forceLink,
              manyBody: forceManyBody,
              center: forceCenter,
              collide: forceCollide,
              radial: forceRadial,
              x: forceX,
              y: forceY,
              z: forceZ,
          };
          this.options = {
              numDimensions: 3,
              link: {
                  id: (edge) => edge.id,
              },
              manyBody: {},
              center: {
                  x: 0,
                  y: 0,
                  z: 0,
              },
          };
      }
      initSimulation() {
          return forceSimulation();
      }
  }

  function commonjsRequire(path) {
  	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
  }

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */

  var _listCacheClear;
  var hasRequired_listCacheClear;

  function require_listCacheClear () {
  	if (hasRequired_listCacheClear) return _listCacheClear;
  	hasRequired_listCacheClear = 1;
  	function listCacheClear() {
  	  this.__data__ = [];
  	  this.size = 0;
  	}

  	_listCacheClear = listCacheClear;
  	return _listCacheClear;
  }

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */

  var eq_1;
  var hasRequiredEq;

  function requireEq () {
  	if (hasRequiredEq) return eq_1;
  	hasRequiredEq = 1;
  	function eq(value, other) {
  	  return value === other || (value !== value && other !== other);
  	}

  	eq_1 = eq;
  	return eq_1;
  }

  var _assocIndexOf;
  var hasRequired_assocIndexOf;

  function require_assocIndexOf () {
  	if (hasRequired_assocIndexOf) return _assocIndexOf;
  	hasRequired_assocIndexOf = 1;
  	var eq = requireEq();

  	/**
  	 * Gets the index at which the `key` is found in `array` of key-value pairs.
  	 *
  	 * @private
  	 * @param {Array} array The array to inspect.
  	 * @param {*} key The key to search for.
  	 * @returns {number} Returns the index of the matched value, else `-1`.
  	 */
  	function assocIndexOf(array, key) {
  	  var length = array.length;
  	  while (length--) {
  	    if (eq(array[length][0], key)) {
  	      return length;
  	    }
  	  }
  	  return -1;
  	}

  	_assocIndexOf = assocIndexOf;
  	return _assocIndexOf;
  }

  var _listCacheDelete;
  var hasRequired_listCacheDelete;

  function require_listCacheDelete () {
  	if (hasRequired_listCacheDelete) return _listCacheDelete;
  	hasRequired_listCacheDelete = 1;
  	var assocIndexOf = require_assocIndexOf();

  	/** Used for built-in method references. */
  	var arrayProto = Array.prototype;

  	/** Built-in value references. */
  	var splice = arrayProto.splice;

  	/**
  	 * Removes `key` and its value from the list cache.
  	 *
  	 * @private
  	 * @name delete
  	 * @memberOf ListCache
  	 * @param {string} key The key of the value to remove.
  	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
  	 */
  	function listCacheDelete(key) {
  	  var data = this.__data__,
  	      index = assocIndexOf(data, key);

  	  if (index < 0) {
  	    return false;
  	  }
  	  var lastIndex = data.length - 1;
  	  if (index == lastIndex) {
  	    data.pop();
  	  } else {
  	    splice.call(data, index, 1);
  	  }
  	  --this.size;
  	  return true;
  	}

  	_listCacheDelete = listCacheDelete;
  	return _listCacheDelete;
  }

  var _listCacheGet;
  var hasRequired_listCacheGet;

  function require_listCacheGet () {
  	if (hasRequired_listCacheGet) return _listCacheGet;
  	hasRequired_listCacheGet = 1;
  	var assocIndexOf = require_assocIndexOf();

  	/**
  	 * Gets the list cache value for `key`.
  	 *
  	 * @private
  	 * @name get
  	 * @memberOf ListCache
  	 * @param {string} key The key of the value to get.
  	 * @returns {*} Returns the entry value.
  	 */
  	function listCacheGet(key) {
  	  var data = this.__data__,
  	      index = assocIndexOf(data, key);

  	  return index < 0 ? undefined : data[index][1];
  	}

  	_listCacheGet = listCacheGet;
  	return _listCacheGet;
  }

  var _listCacheHas;
  var hasRequired_listCacheHas;

  function require_listCacheHas () {
  	if (hasRequired_listCacheHas) return _listCacheHas;
  	hasRequired_listCacheHas = 1;
  	var assocIndexOf = require_assocIndexOf();

  	/**
  	 * Checks if a list cache value for `key` exists.
  	 *
  	 * @private
  	 * @name has
  	 * @memberOf ListCache
  	 * @param {string} key The key of the entry to check.
  	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
  	 */
  	function listCacheHas(key) {
  	  return assocIndexOf(this.__data__, key) > -1;
  	}

  	_listCacheHas = listCacheHas;
  	return _listCacheHas;
  }

  var _listCacheSet;
  var hasRequired_listCacheSet;

  function require_listCacheSet () {
  	if (hasRequired_listCacheSet) return _listCacheSet;
  	hasRequired_listCacheSet = 1;
  	var assocIndexOf = require_assocIndexOf();

  	/**
  	 * Sets the list cache `key` to `value`.
  	 *
  	 * @private
  	 * @name set
  	 * @memberOf ListCache
  	 * @param {string} key The key of the value to set.
  	 * @param {*} value The value to set.
  	 * @returns {Object} Returns the list cache instance.
  	 */
  	function listCacheSet(key, value) {
  	  var data = this.__data__,
  	      index = assocIndexOf(data, key);

  	  if (index < 0) {
  	    ++this.size;
  	    data.push([key, value]);
  	  } else {
  	    data[index][1] = value;
  	  }
  	  return this;
  	}

  	_listCacheSet = listCacheSet;
  	return _listCacheSet;
  }

  var _ListCache;
  var hasRequired_ListCache;

  function require_ListCache () {
  	if (hasRequired_ListCache) return _ListCache;
  	hasRequired_ListCache = 1;
  	var listCacheClear = require_listCacheClear(),
  	    listCacheDelete = require_listCacheDelete(),
  	    listCacheGet = require_listCacheGet(),
  	    listCacheHas = require_listCacheHas(),
  	    listCacheSet = require_listCacheSet();

  	/**
  	 * Creates an list cache object.
  	 *
  	 * @private
  	 * @constructor
  	 * @param {Array} [entries] The key-value pairs to cache.
  	 */
  	function ListCache(entries) {
  	  var index = -1,
  	      length = entries == null ? 0 : entries.length;

  	  this.clear();
  	  while (++index < length) {
  	    var entry = entries[index];
  	    this.set(entry[0], entry[1]);
  	  }
  	}

  	// Add methods to `ListCache`.
  	ListCache.prototype.clear = listCacheClear;
  	ListCache.prototype['delete'] = listCacheDelete;
  	ListCache.prototype.get = listCacheGet;
  	ListCache.prototype.has = listCacheHas;
  	ListCache.prototype.set = listCacheSet;

  	_ListCache = ListCache;
  	return _ListCache;
  }

  var _stackClear;
  var hasRequired_stackClear;

  function require_stackClear () {
  	if (hasRequired_stackClear) return _stackClear;
  	hasRequired_stackClear = 1;
  	var ListCache = require_ListCache();

  	/**
  	 * Removes all key-value entries from the stack.
  	 *
  	 * @private
  	 * @name clear
  	 * @memberOf Stack
  	 */
  	function stackClear() {
  	  this.__data__ = new ListCache;
  	  this.size = 0;
  	}

  	_stackClear = stackClear;
  	return _stackClear;
  }

  /**
   * Removes `key` and its value from the stack.
   *
   * @private
   * @name delete
   * @memberOf Stack
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */

  var _stackDelete;
  var hasRequired_stackDelete;

  function require_stackDelete () {
  	if (hasRequired_stackDelete) return _stackDelete;
  	hasRequired_stackDelete = 1;
  	function stackDelete(key) {
  	  var data = this.__data__,
  	      result = data['delete'](key);

  	  this.size = data.size;
  	  return result;
  	}

  	_stackDelete = stackDelete;
  	return _stackDelete;
  }

  /**
   * Gets the stack value for `key`.
   *
   * @private
   * @name get
   * @memberOf Stack
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */

  var _stackGet;
  var hasRequired_stackGet;

  function require_stackGet () {
  	if (hasRequired_stackGet) return _stackGet;
  	hasRequired_stackGet = 1;
  	function stackGet(key) {
  	  return this.__data__.get(key);
  	}

  	_stackGet = stackGet;
  	return _stackGet;
  }

  /**
   * Checks if a stack value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Stack
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */

  var _stackHas;
  var hasRequired_stackHas;

  function require_stackHas () {
  	if (hasRequired_stackHas) return _stackHas;
  	hasRequired_stackHas = 1;
  	function stackHas(key) {
  	  return this.__data__.has(key);
  	}

  	_stackHas = stackHas;
  	return _stackHas;
  }

  /** Detect free variable `global` from Node.js. */

  var _freeGlobal;
  var hasRequired_freeGlobal;

  function require_freeGlobal () {
  	if (hasRequired_freeGlobal) return _freeGlobal;
  	hasRequired_freeGlobal = 1;
  	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

  	_freeGlobal = freeGlobal;
  	return _freeGlobal;
  }

  var _root;
  var hasRequired_root;

  function require_root () {
  	if (hasRequired_root) return _root;
  	hasRequired_root = 1;
  	var freeGlobal = require_freeGlobal();

  	/** Detect free variable `self`. */
  	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  	/** Used as a reference to the global object. */
  	var root = freeGlobal || freeSelf || Function('return this')();

  	_root = root;
  	return _root;
  }

  var _Symbol;
  var hasRequired_Symbol;

  function require_Symbol () {
  	if (hasRequired_Symbol) return _Symbol;
  	hasRequired_Symbol = 1;
  	var root = require_root();

  	/** Built-in value references. */
  	var Symbol = root.Symbol;

  	_Symbol = Symbol;
  	return _Symbol;
  }

  var _getRawTag;
  var hasRequired_getRawTag;

  function require_getRawTag () {
  	if (hasRequired_getRawTag) return _getRawTag;
  	hasRequired_getRawTag = 1;
  	var Symbol = require_Symbol();

  	/** Used for built-in method references. */
  	var objectProto = Object.prototype;

  	/** Used to check objects for own properties. */
  	var hasOwnProperty = objectProto.hasOwnProperty;

  	/**
  	 * Used to resolve the
  	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
  	 * of values.
  	 */
  	var nativeObjectToString = objectProto.toString;

  	/** Built-in value references. */
  	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

  	/**
  	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
  	 *
  	 * @private
  	 * @param {*} value The value to query.
  	 * @returns {string} Returns the raw `toStringTag`.
  	 */
  	function getRawTag(value) {
  	  var isOwn = hasOwnProperty.call(value, symToStringTag),
  	      tag = value[symToStringTag];

  	  try {
  	    value[symToStringTag] = undefined;
  	    var unmasked = true;
  	  } catch (e) {}

  	  var result = nativeObjectToString.call(value);
  	  if (unmasked) {
  	    if (isOwn) {
  	      value[symToStringTag] = tag;
  	    } else {
  	      delete value[symToStringTag];
  	    }
  	  }
  	  return result;
  	}

  	_getRawTag = getRawTag;
  	return _getRawTag;
  }

  /** Used for built-in method references. */

  var _objectToString;
  var hasRequired_objectToString;

  function require_objectToString () {
  	if (hasRequired_objectToString) return _objectToString;
  	hasRequired_objectToString = 1;
  	var objectProto = Object.prototype;

  	/**
  	 * Used to resolve the
  	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
  	 * of values.
  	 */
  	var nativeObjectToString = objectProto.toString;

  	/**
  	 * Converts `value` to a string using `Object.prototype.toString`.
  	 *
  	 * @private
  	 * @param {*} value The value to convert.
  	 * @returns {string} Returns the converted string.
  	 */
  	function objectToString(value) {
  	  return nativeObjectToString.call(value);
  	}

  	_objectToString = objectToString;
  	return _objectToString;
  }

  var _baseGetTag;
  var hasRequired_baseGetTag;

  function require_baseGetTag () {
  	if (hasRequired_baseGetTag) return _baseGetTag;
  	hasRequired_baseGetTag = 1;
  	var Symbol = require_Symbol(),
  	    getRawTag = require_getRawTag(),
  	    objectToString = require_objectToString();

  	/** `Object#toString` result references. */
  	var nullTag = '[object Null]',
  	    undefinedTag = '[object Undefined]';

  	/** Built-in value references. */
  	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

  	/**
  	 * The base implementation of `getTag` without fallbacks for buggy environments.
  	 *
  	 * @private
  	 * @param {*} value The value to query.
  	 * @returns {string} Returns the `toStringTag`.
  	 */
  	function baseGetTag(value) {
  	  if (value == null) {
  	    return value === undefined ? undefinedTag : nullTag;
  	  }
  	  return (symToStringTag && symToStringTag in Object(value))
  	    ? getRawTag(value)
  	    : objectToString(value);
  	}

  	_baseGetTag = baseGetTag;
  	return _baseGetTag;
  }

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */

  var isObject_1;
  var hasRequiredIsObject;

  function requireIsObject () {
  	if (hasRequiredIsObject) return isObject_1;
  	hasRequiredIsObject = 1;
  	function isObject(value) {
  	  var type = typeof value;
  	  return value != null && (type == 'object' || type == 'function');
  	}

  	isObject_1 = isObject;
  	return isObject_1;
  }

  var isFunction_1;
  var hasRequiredIsFunction;

  function requireIsFunction () {
  	if (hasRequiredIsFunction) return isFunction_1;
  	hasRequiredIsFunction = 1;
  	var baseGetTag = require_baseGetTag(),
  	    isObject = requireIsObject();

  	/** `Object#toString` result references. */
  	var asyncTag = '[object AsyncFunction]',
  	    funcTag = '[object Function]',
  	    genTag = '[object GeneratorFunction]',
  	    proxyTag = '[object Proxy]';

  	/**
  	 * Checks if `value` is classified as a `Function` object.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 0.1.0
  	 * @category Lang
  	 * @param {*} value The value to check.
  	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
  	 * @example
  	 *
  	 * _.isFunction(_);
  	 * // => true
  	 *
  	 * _.isFunction(/abc/);
  	 * // => false
  	 */
  	function isFunction(value) {
  	  if (!isObject(value)) {
  	    return false;
  	  }
  	  // The use of `Object#toString` avoids issues with the `typeof` operator
  	  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  	  var tag = baseGetTag(value);
  	  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  	}

  	isFunction_1 = isFunction;
  	return isFunction_1;
  }

  var _coreJsData;
  var hasRequired_coreJsData;

  function require_coreJsData () {
  	if (hasRequired_coreJsData) return _coreJsData;
  	hasRequired_coreJsData = 1;
  	var root = require_root();

  	/** Used to detect overreaching core-js shims. */
  	var coreJsData = root['__core-js_shared__'];

  	_coreJsData = coreJsData;
  	return _coreJsData;
  }

  var _isMasked;
  var hasRequired_isMasked;

  function require_isMasked () {
  	if (hasRequired_isMasked) return _isMasked;
  	hasRequired_isMasked = 1;
  	var coreJsData = require_coreJsData();

  	/** Used to detect methods masquerading as native. */
  	var maskSrcKey = (function() {
  	  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  	  return uid ? ('Symbol(src)_1.' + uid) : '';
  	}());

  	/**
  	 * Checks if `func` has its source masked.
  	 *
  	 * @private
  	 * @param {Function} func The function to check.
  	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
  	 */
  	function isMasked(func) {
  	  return !!maskSrcKey && (maskSrcKey in func);
  	}

  	_isMasked = isMasked;
  	return _isMasked;
  }

  /** Used for built-in method references. */

  var _toSource;
  var hasRequired_toSource;

  function require_toSource () {
  	if (hasRequired_toSource) return _toSource;
  	hasRequired_toSource = 1;
  	var funcProto = Function.prototype;

  	/** Used to resolve the decompiled source of functions. */
  	var funcToString = funcProto.toString;

  	/**
  	 * Converts `func` to its source code.
  	 *
  	 * @private
  	 * @param {Function} func The function to convert.
  	 * @returns {string} Returns the source code.
  	 */
  	function toSource(func) {
  	  if (func != null) {
  	    try {
  	      return funcToString.call(func);
  	    } catch (e) {}
  	    try {
  	      return (func + '');
  	    } catch (e) {}
  	  }
  	  return '';
  	}

  	_toSource = toSource;
  	return _toSource;
  }

  var _baseIsNative;
  var hasRequired_baseIsNative;

  function require_baseIsNative () {
  	if (hasRequired_baseIsNative) return _baseIsNative;
  	hasRequired_baseIsNative = 1;
  	var isFunction = requireIsFunction(),
  	    isMasked = require_isMasked(),
  	    isObject = requireIsObject(),
  	    toSource = require_toSource();

  	/**
  	 * Used to match `RegExp`
  	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
  	 */
  	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

  	/** Used to detect host constructors (Safari). */
  	var reIsHostCtor = /^\[object .+?Constructor\]$/;

  	/** Used for built-in method references. */
  	var funcProto = Function.prototype,
  	    objectProto = Object.prototype;

  	/** Used to resolve the decompiled source of functions. */
  	var funcToString = funcProto.toString;

  	/** Used to check objects for own properties. */
  	var hasOwnProperty = objectProto.hasOwnProperty;

  	/** Used to detect if a method is native. */
  	var reIsNative = RegExp('^' +
  	  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  	);

  	/**
  	 * The base implementation of `_.isNative` without bad shim checks.
  	 *
  	 * @private
  	 * @param {*} value The value to check.
  	 * @returns {boolean} Returns `true` if `value` is a native function,
  	 *  else `false`.
  	 */
  	function baseIsNative(value) {
  	  if (!isObject(value) || isMasked(value)) {
  	    return false;
  	  }
  	  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  	  return pattern.test(toSource(value));
  	}

  	_baseIsNative = baseIsNative;
  	return _baseIsNative;
  }

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */

  var _getValue;
  var hasRequired_getValue;

  function require_getValue () {
  	if (hasRequired_getValue) return _getValue;
  	hasRequired_getValue = 1;
  	function getValue(object, key) {
  	  return object == null ? undefined : object[key];
  	}

  	_getValue = getValue;
  	return _getValue;
  }

  var _getNative;
  var hasRequired_getNative;

  function require_getNative () {
  	if (hasRequired_getNative) return _getNative;
  	hasRequired_getNative = 1;
  	var baseIsNative = require_baseIsNative(),
  	    getValue = require_getValue();

  	/**
  	 * Gets the native function at `key` of `object`.
  	 *
  	 * @private
  	 * @param {Object} object The object to query.
  	 * @param {string} key The key of the method to get.
  	 * @returns {*} Returns the function if it's native, else `undefined`.
  	 */
  	function getNative(object, key) {
  	  var value = getValue(object, key);
  	  return baseIsNative(value) ? value : undefined;
  	}

  	_getNative = getNative;
  	return _getNative;
  }

  var _Map;
  var hasRequired_Map;

  function require_Map () {
  	if (hasRequired_Map) return _Map;
  	hasRequired_Map = 1;
  	var getNative = require_getNative(),
  	    root = require_root();

  	/* Built-in method references that are verified to be native. */
  	var Map = getNative(root, 'Map');

  	_Map = Map;
  	return _Map;
  }

  var _nativeCreate;
  var hasRequired_nativeCreate;

  function require_nativeCreate () {
  	if (hasRequired_nativeCreate) return _nativeCreate;
  	hasRequired_nativeCreate = 1;
  	var getNative = require_getNative();

  	/* Built-in method references that are verified to be native. */
  	var nativeCreate = getNative(Object, 'create');

  	_nativeCreate = nativeCreate;
  	return _nativeCreate;
  }

  var _hashClear;
  var hasRequired_hashClear;

  function require_hashClear () {
  	if (hasRequired_hashClear) return _hashClear;
  	hasRequired_hashClear = 1;
  	var nativeCreate = require_nativeCreate();

  	/**
  	 * Removes all key-value entries from the hash.
  	 *
  	 * @private
  	 * @name clear
  	 * @memberOf Hash
  	 */
  	function hashClear() {
  	  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  	  this.size = 0;
  	}

  	_hashClear = hashClear;
  	return _hashClear;
  }

  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */

  var _hashDelete;
  var hasRequired_hashDelete;

  function require_hashDelete () {
  	if (hasRequired_hashDelete) return _hashDelete;
  	hasRequired_hashDelete = 1;
  	function hashDelete(key) {
  	  var result = this.has(key) && delete this.__data__[key];
  	  this.size -= result ? 1 : 0;
  	  return result;
  	}

  	_hashDelete = hashDelete;
  	return _hashDelete;
  }

  var _hashGet;
  var hasRequired_hashGet;

  function require_hashGet () {
  	if (hasRequired_hashGet) return _hashGet;
  	hasRequired_hashGet = 1;
  	var nativeCreate = require_nativeCreate();

  	/** Used to stand-in for `undefined` hash values. */
  	var HASH_UNDEFINED = '__lodash_hash_undefined__';

  	/** Used for built-in method references. */
  	var objectProto = Object.prototype;

  	/** Used to check objects for own properties. */
  	var hasOwnProperty = objectProto.hasOwnProperty;

  	/**
  	 * Gets the hash value for `key`.
  	 *
  	 * @private
  	 * @name get
  	 * @memberOf Hash
  	 * @param {string} key The key of the value to get.
  	 * @returns {*} Returns the entry value.
  	 */
  	function hashGet(key) {
  	  var data = this.__data__;
  	  if (nativeCreate) {
  	    var result = data[key];
  	    return result === HASH_UNDEFINED ? undefined : result;
  	  }
  	  return hasOwnProperty.call(data, key) ? data[key] : undefined;
  	}

  	_hashGet = hashGet;
  	return _hashGet;
  }

  var _hashHas;
  var hasRequired_hashHas;

  function require_hashHas () {
  	if (hasRequired_hashHas) return _hashHas;
  	hasRequired_hashHas = 1;
  	var nativeCreate = require_nativeCreate();

  	/** Used for built-in method references. */
  	var objectProto = Object.prototype;

  	/** Used to check objects for own properties. */
  	var hasOwnProperty = objectProto.hasOwnProperty;

  	/**
  	 * Checks if a hash value for `key` exists.
  	 *
  	 * @private
  	 * @name has
  	 * @memberOf Hash
  	 * @param {string} key The key of the entry to check.
  	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
  	 */
  	function hashHas(key) {
  	  var data = this.__data__;
  	  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
  	}

  	_hashHas = hashHas;
  	return _hashHas;
  }

  var _hashSet;
  var hasRequired_hashSet;

  function require_hashSet () {
  	if (hasRequired_hashSet) return _hashSet;
  	hasRequired_hashSet = 1;
  	var nativeCreate = require_nativeCreate();

  	/** Used to stand-in for `undefined` hash values. */
  	var HASH_UNDEFINED = '__lodash_hash_undefined__';

  	/**
  	 * Sets the hash `key` to `value`.
  	 *
  	 * @private
  	 * @name set
  	 * @memberOf Hash
  	 * @param {string} key The key of the value to set.
  	 * @param {*} value The value to set.
  	 * @returns {Object} Returns the hash instance.
  	 */
  	function hashSet(key, value) {
  	  var data = this.__data__;
  	  this.size += this.has(key) ? 0 : 1;
  	  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  	  return this;
  	}

  	_hashSet = hashSet;
  	return _hashSet;
  }

  var _Hash;
  var hasRequired_Hash;

  function require_Hash () {
  	if (hasRequired_Hash) return _Hash;
  	hasRequired_Hash = 1;
  	var hashClear = require_hashClear(),
  	    hashDelete = require_hashDelete(),
  	    hashGet = require_hashGet(),
  	    hashHas = require_hashHas(),
  	    hashSet = require_hashSet();

  	/**
  	 * Creates a hash object.
  	 *
  	 * @private
  	 * @constructor
  	 * @param {Array} [entries] The key-value pairs to cache.
  	 */
  	function Hash(entries) {
  	  var index = -1,
  	      length = entries == null ? 0 : entries.length;

  	  this.clear();
  	  while (++index < length) {
  	    var entry = entries[index];
  	    this.set(entry[0], entry[1]);
  	  }
  	}

  	// Add methods to `Hash`.
  	Hash.prototype.clear = hashClear;
  	Hash.prototype['delete'] = hashDelete;
  	Hash.prototype.get = hashGet;
  	Hash.prototype.has = hashHas;
  	Hash.prototype.set = hashSet;

  	_Hash = Hash;
  	return _Hash;
  }

  var _mapCacheClear;
  var hasRequired_mapCacheClear;

  function require_mapCacheClear () {
  	if (hasRequired_mapCacheClear) return _mapCacheClear;
  	hasRequired_mapCacheClear = 1;
  	var Hash = require_Hash(),
  	    ListCache = require_ListCache(),
  	    Map = require_Map();

  	/**
  	 * Removes all key-value entries from the map.
  	 *
  	 * @private
  	 * @name clear
  	 * @memberOf MapCache
  	 */
  	function mapCacheClear() {
  	  this.size = 0;
  	  this.__data__ = {
  	    'hash': new Hash,
  	    'map': new (Map || ListCache),
  	    'string': new Hash
  	  };
  	}

  	_mapCacheClear = mapCacheClear;
  	return _mapCacheClear;
  }

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */

  var _isKeyable;
  var hasRequired_isKeyable;

  function require_isKeyable () {
  	if (hasRequired_isKeyable) return _isKeyable;
  	hasRequired_isKeyable = 1;
  	function isKeyable(value) {
  	  var type = typeof value;
  	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
  	    ? (value !== '__proto__')
  	    : (value === null);
  	}

  	_isKeyable = isKeyable;
  	return _isKeyable;
  }

  var _getMapData;
  var hasRequired_getMapData;

  function require_getMapData () {
  	if (hasRequired_getMapData) return _getMapData;
  	hasRequired_getMapData = 1;
  	var isKeyable = require_isKeyable();

  	/**
  	 * Gets the data for `map`.
  	 *
  	 * @private
  	 * @param {Object} map The map to query.
  	 * @param {string} key The reference key.
  	 * @returns {*} Returns the map data.
  	 */
  	function getMapData(map, key) {
  	  var data = map.__data__;
  	  return isKeyable(key)
  	    ? data[typeof key == 'string' ? 'string' : 'hash']
  	    : data.map;
  	}

  	_getMapData = getMapData;
  	return _getMapData;
  }

  var _mapCacheDelete;
  var hasRequired_mapCacheDelete;

  function require_mapCacheDelete () {
  	if (hasRequired_mapCacheDelete) return _mapCacheDelete;
  	hasRequired_mapCacheDelete = 1;
  	var getMapData = require_getMapData();

  	/**
  	 * Removes `key` and its value from the map.
  	 *
  	 * @private
  	 * @name delete
  	 * @memberOf MapCache
  	 * @param {string} key The key of the value to remove.
  	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
  	 */
  	function mapCacheDelete(key) {
  	  var result = getMapData(this, key)['delete'](key);
  	  this.size -= result ? 1 : 0;
  	  return result;
  	}

  	_mapCacheDelete = mapCacheDelete;
  	return _mapCacheDelete;
  }

  var _mapCacheGet;
  var hasRequired_mapCacheGet;

  function require_mapCacheGet () {
  	if (hasRequired_mapCacheGet) return _mapCacheGet;
  	hasRequired_mapCacheGet = 1;
  	var getMapData = require_getMapData();

  	/**
  	 * Gets the map value for `key`.
  	 *
  	 * @private
  	 * @name get
  	 * @memberOf MapCache
  	 * @param {string} key The key of the value to get.
  	 * @returns {*} Returns the entry value.
  	 */
  	function mapCacheGet(key) {
  	  return getMapData(this, key).get(key);
  	}

  	_mapCacheGet = mapCacheGet;
  	return _mapCacheGet;
  }

  var _mapCacheHas;
  var hasRequired_mapCacheHas;

  function require_mapCacheHas () {
  	if (hasRequired_mapCacheHas) return _mapCacheHas;
  	hasRequired_mapCacheHas = 1;
  	var getMapData = require_getMapData();

  	/**
  	 * Checks if a map value for `key` exists.
  	 *
  	 * @private
  	 * @name has
  	 * @memberOf MapCache
  	 * @param {string} key The key of the entry to check.
  	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
  	 */
  	function mapCacheHas(key) {
  	  return getMapData(this, key).has(key);
  	}

  	_mapCacheHas = mapCacheHas;
  	return _mapCacheHas;
  }

  var _mapCacheSet;
  var hasRequired_mapCacheSet;

  function require_mapCacheSet () {
  	if (hasRequired_mapCacheSet) return _mapCacheSet;
  	hasRequired_mapCacheSet = 1;
  	var getMapData = require_getMapData();

  	/**
  	 * Sets the map `key` to `value`.
  	 *
  	 * @private
  	 * @name set
  	 * @memberOf MapCache
  	 * @param {string} key The key of the value to set.
  	 * @param {*} value The value to set.
  	 * @returns {Object} Returns the map cache instance.
  	 */
  	function mapCacheSet(key, value) {
  	  var data = getMapData(this, key),
  	      size = data.size;

  	  data.set(key, value);
  	  this.size += data.size == size ? 0 : 1;
  	  return this;
  	}

  	_mapCacheSet = mapCacheSet;
  	return _mapCacheSet;
  }

  var _MapCache;
  var hasRequired_MapCache;

  function require_MapCache () {
  	if (hasRequired_MapCache) return _MapCache;
  	hasRequired_MapCache = 1;
  	var mapCacheClear = require_mapCacheClear(),
  	    mapCacheDelete = require_mapCacheDelete(),
  	    mapCacheGet = require_mapCacheGet(),
  	    mapCacheHas = require_mapCacheHas(),
  	    mapCacheSet = require_mapCacheSet();

  	/**
  	 * Creates a map cache object to store key-value pairs.
  	 *
  	 * @private
  	 * @constructor
  	 * @param {Array} [entries] The key-value pairs to cache.
  	 */
  	function MapCache(entries) {
  	  var index = -1,
  	      length = entries == null ? 0 : entries.length;

  	  this.clear();
  	  while (++index < length) {
  	    var entry = entries[index];
  	    this.set(entry[0], entry[1]);
  	  }
  	}

  	// Add methods to `MapCache`.
  	MapCache.prototype.clear = mapCacheClear;
  	MapCache.prototype['delete'] = mapCacheDelete;
  	MapCache.prototype.get = mapCacheGet;
  	MapCache.prototype.has = mapCacheHas;
  	MapCache.prototype.set = mapCacheSet;

  	_MapCache = MapCache;
  	return _MapCache;
  }

  var _stackSet;
  var hasRequired_stackSet;

  function require_stackSet () {
  	if (hasRequired_stackSet) return _stackSet;
  	hasRequired_stackSet = 1;
  	var ListCache = require_ListCache(),
  	    Map = require_Map(),
  	    MapCache = require_MapCache();

  	/** Used as the size to enable large array optimizations. */
  	var LARGE_ARRAY_SIZE = 200;

  	/**
  	 * Sets the stack `key` to `value`.
  	 *
  	 * @private
  	 * @name set
  	 * @memberOf Stack
  	 * @param {string} key The key of the value to set.
  	 * @param {*} value The value to set.
  	 * @returns {Object} Returns the stack cache instance.
  	 */
  	function stackSet(key, value) {
  	  var data = this.__data__;
  	  if (data instanceof ListCache) {
  	    var pairs = data.__data__;
  	    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
  	      pairs.push([key, value]);
  	      this.size = ++data.size;
  	      return this;
  	    }
  	    data = this.__data__ = new MapCache(pairs);
  	  }
  	  data.set(key, value);
  	  this.size = data.size;
  	  return this;
  	}

  	_stackSet = stackSet;
  	return _stackSet;
  }

  var _Stack;
  var hasRequired_Stack;

  function require_Stack () {
  	if (hasRequired_Stack) return _Stack;
  	hasRequired_Stack = 1;
  	var ListCache = require_ListCache(),
  	    stackClear = require_stackClear(),
  	    stackDelete = require_stackDelete(),
  	    stackGet = require_stackGet(),
  	    stackHas = require_stackHas(),
  	    stackSet = require_stackSet();

  	/**
  	 * Creates a stack cache object to store key-value pairs.
  	 *
  	 * @private
  	 * @constructor
  	 * @param {Array} [entries] The key-value pairs to cache.
  	 */
  	function Stack(entries) {
  	  var data = this.__data__ = new ListCache(entries);
  	  this.size = data.size;
  	}

  	// Add methods to `Stack`.
  	Stack.prototype.clear = stackClear;
  	Stack.prototype['delete'] = stackDelete;
  	Stack.prototype.get = stackGet;
  	Stack.prototype.has = stackHas;
  	Stack.prototype.set = stackSet;

  	_Stack = Stack;
  	return _Stack;
  }

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */

  var _arrayEach;
  var hasRequired_arrayEach;

  function require_arrayEach () {
  	if (hasRequired_arrayEach) return _arrayEach;
  	hasRequired_arrayEach = 1;
  	function arrayEach(array, iteratee) {
  	  var index = -1,
  	      length = array == null ? 0 : array.length;

  	  while (++index < length) {
  	    if (iteratee(array[index], index, array) === false) {
  	      break;
  	    }
  	  }
  	  return array;
  	}

  	_arrayEach = arrayEach;
  	return _arrayEach;
  }

  var _defineProperty;
  var hasRequired_defineProperty;

  function require_defineProperty () {
  	if (hasRequired_defineProperty) return _defineProperty;
  	hasRequired_defineProperty = 1;
  	var getNative = require_getNative();

  	var defineProperty = (function() {
  	  try {
  	    var func = getNative(Object, 'defineProperty');
  	    func({}, '', {});
  	    return func;
  	  } catch (e) {}
  	}());

  	_defineProperty = defineProperty;
  	return _defineProperty;
  }

  var _baseAssignValue;
  var hasRequired_baseAssignValue;

  function require_baseAssignValue () {
  	if (hasRequired_baseAssignValue) return _baseAssignValue;
  	hasRequired_baseAssignValue = 1;
  	var defineProperty = require_defineProperty();

  	/**
  	 * The base implementation of `assignValue` and `assignMergeValue` without
  	 * value checks.
  	 *
  	 * @private
  	 * @param {Object} object The object to modify.
  	 * @param {string} key The key of the property to assign.
  	 * @param {*} value The value to assign.
  	 */
  	function baseAssignValue(object, key, value) {
  	  if (key == '__proto__' && defineProperty) {
  	    defineProperty(object, key, {
  	      'configurable': true,
  	      'enumerable': true,
  	      'value': value,
  	      'writable': true
  	    });
  	  } else {
  	    object[key] = value;
  	  }
  	}

  	_baseAssignValue = baseAssignValue;
  	return _baseAssignValue;
  }

  var _assignValue;
  var hasRequired_assignValue;

  function require_assignValue () {
  	if (hasRequired_assignValue) return _assignValue;
  	hasRequired_assignValue = 1;
  	var baseAssignValue = require_baseAssignValue(),
  	    eq = requireEq();

  	/** Used for built-in method references. */
  	var objectProto = Object.prototype;

  	/** Used to check objects for own properties. */
  	var hasOwnProperty = objectProto.hasOwnProperty;

  	/**
  	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
  	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
  	 * for equality comparisons.
  	 *
  	 * @private
  	 * @param {Object} object The object to modify.
  	 * @param {string} key The key of the property to assign.
  	 * @param {*} value The value to assign.
  	 */
  	function assignValue(object, key, value) {
  	  var objValue = object[key];
  	  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
  	      (value === undefined && !(key in object))) {
  	    baseAssignValue(object, key, value);
  	  }
  	}

  	_assignValue = assignValue;
  	return _assignValue;
  }

  var _copyObject;
  var hasRequired_copyObject;

  function require_copyObject () {
  	if (hasRequired_copyObject) return _copyObject;
  	hasRequired_copyObject = 1;
  	var assignValue = require_assignValue(),
  	    baseAssignValue = require_baseAssignValue();

  	/**
  	 * Copies properties of `source` to `object`.
  	 *
  	 * @private
  	 * @param {Object} source The object to copy properties from.
  	 * @param {Array} props The property identifiers to copy.
  	 * @param {Object} [object={}] The object to copy properties to.
  	 * @param {Function} [customizer] The function to customize copied values.
  	 * @returns {Object} Returns `object`.
  	 */
  	function copyObject(source, props, object, customizer) {
  	  var isNew = !object;
  	  object || (object = {});

  	  var index = -1,
  	      length = props.length;

  	  while (++index < length) {
  	    var key = props[index];

  	    var newValue = customizer
  	      ? customizer(object[key], source[key], key, object, source)
  	      : undefined;

  	    if (newValue === undefined) {
  	      newValue = source[key];
  	    }
  	    if (isNew) {
  	      baseAssignValue(object, key, newValue);
  	    } else {
  	      assignValue(object, key, newValue);
  	    }
  	  }
  	  return object;
  	}

  	_copyObject = copyObject;
  	return _copyObject;
  }

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */

  var _baseTimes;
  var hasRequired_baseTimes;

  function require_baseTimes () {
  	if (hasRequired_baseTimes) return _baseTimes;
  	hasRequired_baseTimes = 1;
  	function baseTimes(n, iteratee) {
  	  var index = -1,
  	      result = Array(n);

  	  while (++index < n) {
  	    result[index] = iteratee(index);
  	  }
  	  return result;
  	}

  	_baseTimes = baseTimes;
  	return _baseTimes;
  }

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */

  var isObjectLike_1;
  var hasRequiredIsObjectLike;

  function requireIsObjectLike () {
  	if (hasRequiredIsObjectLike) return isObjectLike_1;
  	hasRequiredIsObjectLike = 1;
  	function isObjectLike(value) {
  	  return value != null && typeof value == 'object';
  	}

  	isObjectLike_1 = isObjectLike;
  	return isObjectLike_1;
  }

  var _baseIsArguments;
  var hasRequired_baseIsArguments;

  function require_baseIsArguments () {
  	if (hasRequired_baseIsArguments) return _baseIsArguments;
  	hasRequired_baseIsArguments = 1;
  	var baseGetTag = require_baseGetTag(),
  	    isObjectLike = requireIsObjectLike();

  	/** `Object#toString` result references. */
  	var argsTag = '[object Arguments]';

  	/**
  	 * The base implementation of `_.isArguments`.
  	 *
  	 * @private
  	 * @param {*} value The value to check.
  	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
  	 */
  	function baseIsArguments(value) {
  	  return isObjectLike(value) && baseGetTag(value) == argsTag;
  	}

  	_baseIsArguments = baseIsArguments;
  	return _baseIsArguments;
  }

  var isArguments_1;
  var hasRequiredIsArguments;

  function requireIsArguments () {
  	if (hasRequiredIsArguments) return isArguments_1;
  	hasRequiredIsArguments = 1;
  	var baseIsArguments = require_baseIsArguments(),
  	    isObjectLike = requireIsObjectLike();

  	/** Used for built-in method references. */
  	var objectProto = Object.prototype;

  	/** Used to check objects for own properties. */
  	var hasOwnProperty = objectProto.hasOwnProperty;

  	/** Built-in value references. */
  	var propertyIsEnumerable = objectProto.propertyIsEnumerable;

  	/**
  	 * Checks if `value` is likely an `arguments` object.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 0.1.0
  	 * @category Lang
  	 * @param {*} value The value to check.
  	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
  	 *  else `false`.
  	 * @example
  	 *
  	 * _.isArguments(function() { return arguments; }());
  	 * // => true
  	 *
  	 * _.isArguments([1, 2, 3]);
  	 * // => false
  	 */
  	var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  	  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
  	    !propertyIsEnumerable.call(value, 'callee');
  	};

  	isArguments_1 = isArguments;
  	return isArguments_1;
  }

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */

  var isArray_1;
  var hasRequiredIsArray;

  function requireIsArray () {
  	if (hasRequiredIsArray) return isArray_1;
  	hasRequiredIsArray = 1;
  	var isArray = Array.isArray;

  	isArray_1 = isArray;
  	return isArray_1;
  }

  var isBuffer = {exports: {}};

  /**
   * This method returns `false`.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {boolean} Returns `false`.
   * @example
   *
   * _.times(2, _.stubFalse);
   * // => [false, false]
   */

  var stubFalse_1;
  var hasRequiredStubFalse;

  function requireStubFalse () {
  	if (hasRequiredStubFalse) return stubFalse_1;
  	hasRequiredStubFalse = 1;
  	function stubFalse() {
  	  return false;
  	}

  	stubFalse_1 = stubFalse;
  	return stubFalse_1;
  }

  isBuffer.exports;

  var hasRequiredIsBuffer;

  function requireIsBuffer () {
  	if (hasRequiredIsBuffer) return isBuffer.exports;
  	hasRequiredIsBuffer = 1;
  	(function (module, exports) {
  		var root = require_root(),
  		    stubFalse = requireStubFalse();

  		/** Detect free variable `exports`. */
  		var freeExports = exports && !exports.nodeType && exports;

  		/** Detect free variable `module`. */
  		var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

  		/** Detect the popular CommonJS extension `module.exports`. */
  		var moduleExports = freeModule && freeModule.exports === freeExports;

  		/** Built-in value references. */
  		var Buffer = moduleExports ? root.Buffer : undefined;

  		/* Built-in method references for those with the same name as other `lodash` methods. */
  		var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

  		/**
  		 * Checks if `value` is a buffer.
  		 *
  		 * @static
  		 * @memberOf _
  		 * @since 4.3.0
  		 * @category Lang
  		 * @param {*} value The value to check.
  		 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
  		 * @example
  		 *
  		 * _.isBuffer(new Buffer(2));
  		 * // => true
  		 *
  		 * _.isBuffer(new Uint8Array(2));
  		 * // => false
  		 */
  		var isBuffer = nativeIsBuffer || stubFalse;

  		module.exports = isBuffer; 
  	} (isBuffer, isBuffer.exports));
  	return isBuffer.exports;
  }

  /** Used as references for various `Number` constants. */

  var _isIndex;
  var hasRequired_isIndex;

  function require_isIndex () {
  	if (hasRequired_isIndex) return _isIndex;
  	hasRequired_isIndex = 1;
  	var MAX_SAFE_INTEGER = 9007199254740991;

  	/** Used to detect unsigned integer values. */
  	var reIsUint = /^(?:0|[1-9]\d*)$/;

  	/**
  	 * Checks if `value` is a valid array-like index.
  	 *
  	 * @private
  	 * @param {*} value The value to check.
  	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
  	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
  	 */
  	function isIndex(value, length) {
  	  var type = typeof value;
  	  length = length == null ? MAX_SAFE_INTEGER : length;

  	  return !!length &&
  	    (type == 'number' ||
  	      (type != 'symbol' && reIsUint.test(value))) &&
  	        (value > -1 && value % 1 == 0 && value < length);
  	}

  	_isIndex = isIndex;
  	return _isIndex;
  }

  /** Used as references for various `Number` constants. */

  var isLength_1;
  var hasRequiredIsLength;

  function requireIsLength () {
  	if (hasRequiredIsLength) return isLength_1;
  	hasRequiredIsLength = 1;
  	var MAX_SAFE_INTEGER = 9007199254740991;

  	/**
  	 * Checks if `value` is a valid array-like length.
  	 *
  	 * **Note:** This method is loosely based on
  	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 4.0.0
  	 * @category Lang
  	 * @param {*} value The value to check.
  	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
  	 * @example
  	 *
  	 * _.isLength(3);
  	 * // => true
  	 *
  	 * _.isLength(Number.MIN_VALUE);
  	 * // => false
  	 *
  	 * _.isLength(Infinity);
  	 * // => false
  	 *
  	 * _.isLength('3');
  	 * // => false
  	 */
  	function isLength(value) {
  	  return typeof value == 'number' &&
  	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  	}

  	isLength_1 = isLength;
  	return isLength_1;
  }

  var _baseIsTypedArray;
  var hasRequired_baseIsTypedArray;

  function require_baseIsTypedArray () {
  	if (hasRequired_baseIsTypedArray) return _baseIsTypedArray;
  	hasRequired_baseIsTypedArray = 1;
  	var baseGetTag = require_baseGetTag(),
  	    isLength = requireIsLength(),
  	    isObjectLike = requireIsObjectLike();

  	/** `Object#toString` result references. */
  	var argsTag = '[object Arguments]',
  	    arrayTag = '[object Array]',
  	    boolTag = '[object Boolean]',
  	    dateTag = '[object Date]',
  	    errorTag = '[object Error]',
  	    funcTag = '[object Function]',
  	    mapTag = '[object Map]',
  	    numberTag = '[object Number]',
  	    objectTag = '[object Object]',
  	    regexpTag = '[object RegExp]',
  	    setTag = '[object Set]',
  	    stringTag = '[object String]',
  	    weakMapTag = '[object WeakMap]';

  	var arrayBufferTag = '[object ArrayBuffer]',
  	    dataViewTag = '[object DataView]',
  	    float32Tag = '[object Float32Array]',
  	    float64Tag = '[object Float64Array]',
  	    int8Tag = '[object Int8Array]',
  	    int16Tag = '[object Int16Array]',
  	    int32Tag = '[object Int32Array]',
  	    uint8Tag = '[object Uint8Array]',
  	    uint8ClampedTag = '[object Uint8ClampedArray]',
  	    uint16Tag = '[object Uint16Array]',
  	    uint32Tag = '[object Uint32Array]';

  	/** Used to identify `toStringTag` values of typed arrays. */
  	var typedArrayTags = {};
  	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  	typedArrayTags[uint32Tag] = true;
  	typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  	typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
  	typedArrayTags[errorTag] = typedArrayTags[funcTag] =
  	typedArrayTags[mapTag] = typedArrayTags[numberTag] =
  	typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
  	typedArrayTags[setTag] = typedArrayTags[stringTag] =
  	typedArrayTags[weakMapTag] = false;

  	/**
  	 * The base implementation of `_.isTypedArray` without Node.js optimizations.
  	 *
  	 * @private
  	 * @param {*} value The value to check.
  	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
  	 */
  	function baseIsTypedArray(value) {
  	  return isObjectLike(value) &&
  	    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
  	}

  	_baseIsTypedArray = baseIsTypedArray;
  	return _baseIsTypedArray;
  }

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */

  var _baseUnary;
  var hasRequired_baseUnary;

  function require_baseUnary () {
  	if (hasRequired_baseUnary) return _baseUnary;
  	hasRequired_baseUnary = 1;
  	function baseUnary(func) {
  	  return function(value) {
  	    return func(value);
  	  };
  	}

  	_baseUnary = baseUnary;
  	return _baseUnary;
  }

  var _nodeUtil = {exports: {}};

  _nodeUtil.exports;

  var hasRequired_nodeUtil;

  function require_nodeUtil () {
  	if (hasRequired_nodeUtil) return _nodeUtil.exports;
  	hasRequired_nodeUtil = 1;
  	(function (module, exports) {
  		var freeGlobal = require_freeGlobal();

  		/** Detect free variable `exports`. */
  		var freeExports = exports && !exports.nodeType && exports;

  		/** Detect free variable `module`. */
  		var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

  		/** Detect the popular CommonJS extension `module.exports`. */
  		var moduleExports = freeModule && freeModule.exports === freeExports;

  		/** Detect free variable `process` from Node.js. */
  		var freeProcess = moduleExports && freeGlobal.process;

  		/** Used to access faster Node.js helpers. */
  		var nodeUtil = (function() {
  		  try {
  		    // Use `util.types` for Node.js 10+.
  		    var types = freeModule && freeModule.require && freeModule.require('util').types;

  		    if (types) {
  		      return types;
  		    }

  		    // Legacy `process.binding('util')` for Node.js < 10.
  		    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  		  } catch (e) {}
  		}());

  		module.exports = nodeUtil; 
  	} (_nodeUtil, _nodeUtil.exports));
  	return _nodeUtil.exports;
  }

  var isTypedArray_1;
  var hasRequiredIsTypedArray;

  function requireIsTypedArray () {
  	if (hasRequiredIsTypedArray) return isTypedArray_1;
  	hasRequiredIsTypedArray = 1;
  	var baseIsTypedArray = require_baseIsTypedArray(),
  	    baseUnary = require_baseUnary(),
  	    nodeUtil = require_nodeUtil();

  	/* Node.js helper references. */
  	var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

  	/**
  	 * Checks if `value` is classified as a typed array.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 3.0.0
  	 * @category Lang
  	 * @param {*} value The value to check.
  	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
  	 * @example
  	 *
  	 * _.isTypedArray(new Uint8Array);
  	 * // => true
  	 *
  	 * _.isTypedArray([]);
  	 * // => false
  	 */
  	var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

  	isTypedArray_1 = isTypedArray;
  	return isTypedArray_1;
  }

  var _arrayLikeKeys;
  var hasRequired_arrayLikeKeys;

  function require_arrayLikeKeys () {
  	if (hasRequired_arrayLikeKeys) return _arrayLikeKeys;
  	hasRequired_arrayLikeKeys = 1;
  	var baseTimes = require_baseTimes(),
  	    isArguments = requireIsArguments(),
  	    isArray = requireIsArray(),
  	    isBuffer = requireIsBuffer(),
  	    isIndex = require_isIndex(),
  	    isTypedArray = requireIsTypedArray();

  	/** Used for built-in method references. */
  	var objectProto = Object.prototype;

  	/** Used to check objects for own properties. */
  	var hasOwnProperty = objectProto.hasOwnProperty;

  	/**
  	 * Creates an array of the enumerable property names of the array-like `value`.
  	 *
  	 * @private
  	 * @param {*} value The value to query.
  	 * @param {boolean} inherited Specify returning inherited property names.
  	 * @returns {Array} Returns the array of property names.
  	 */
  	function arrayLikeKeys(value, inherited) {
  	  var isArr = isArray(value),
  	      isArg = !isArr && isArguments(value),
  	      isBuff = !isArr && !isArg && isBuffer(value),
  	      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
  	      skipIndexes = isArr || isArg || isBuff || isType,
  	      result = skipIndexes ? baseTimes(value.length, String) : [],
  	      length = result.length;

  	  for (var key in value) {
  	    if ((inherited || hasOwnProperty.call(value, key)) &&
  	        !(skipIndexes && (
  	           // Safari 9 has enumerable `arguments.length` in strict mode.
  	           key == 'length' ||
  	           // Node.js 0.10 has enumerable non-index properties on buffers.
  	           (isBuff && (key == 'offset' || key == 'parent')) ||
  	           // PhantomJS 2 has enumerable non-index properties on typed arrays.
  	           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
  	           // Skip index properties.
  	           isIndex(key, length)
  	        ))) {
  	      result.push(key);
  	    }
  	  }
  	  return result;
  	}

  	_arrayLikeKeys = arrayLikeKeys;
  	return _arrayLikeKeys;
  }

  /** Used for built-in method references. */

  var _isPrototype;
  var hasRequired_isPrototype;

  function require_isPrototype () {
  	if (hasRequired_isPrototype) return _isPrototype;
  	hasRequired_isPrototype = 1;
  	var objectProto = Object.prototype;

  	/**
  	 * Checks if `value` is likely a prototype object.
  	 *
  	 * @private
  	 * @param {*} value The value to check.
  	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
  	 */
  	function isPrototype(value) {
  	  var Ctor = value && value.constructor,
  	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  	  return value === proto;
  	}

  	_isPrototype = isPrototype;
  	return _isPrototype;
  }

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */

  var _overArg;
  var hasRequired_overArg;

  function require_overArg () {
  	if (hasRequired_overArg) return _overArg;
  	hasRequired_overArg = 1;
  	function overArg(func, transform) {
  	  return function(arg) {
  	    return func(transform(arg));
  	  };
  	}

  	_overArg = overArg;
  	return _overArg;
  }

  var _nativeKeys;
  var hasRequired_nativeKeys;

  function require_nativeKeys () {
  	if (hasRequired_nativeKeys) return _nativeKeys;
  	hasRequired_nativeKeys = 1;
  	var overArg = require_overArg();

  	/* Built-in method references for those with the same name as other `lodash` methods. */
  	var nativeKeys = overArg(Object.keys, Object);

  	_nativeKeys = nativeKeys;
  	return _nativeKeys;
  }

  var _baseKeys;
  var hasRequired_baseKeys;

  function require_baseKeys () {
  	if (hasRequired_baseKeys) return _baseKeys;
  	hasRequired_baseKeys = 1;
  	var isPrototype = require_isPrototype(),
  	    nativeKeys = require_nativeKeys();

  	/** Used for built-in method references. */
  	var objectProto = Object.prototype;

  	/** Used to check objects for own properties. */
  	var hasOwnProperty = objectProto.hasOwnProperty;

  	/**
  	 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
  	 *
  	 * @private
  	 * @param {Object} object The object to query.
  	 * @returns {Array} Returns the array of property names.
  	 */
  	function baseKeys(object) {
  	  if (!isPrototype(object)) {
  	    return nativeKeys(object);
  	  }
  	  var result = [];
  	  for (var key in Object(object)) {
  	    if (hasOwnProperty.call(object, key) && key != 'constructor') {
  	      result.push(key);
  	    }
  	  }
  	  return result;
  	}

  	_baseKeys = baseKeys;
  	return _baseKeys;
  }

  var isArrayLike_1;
  var hasRequiredIsArrayLike;

  function requireIsArrayLike () {
  	if (hasRequiredIsArrayLike) return isArrayLike_1;
  	hasRequiredIsArrayLike = 1;
  	var isFunction = requireIsFunction(),
  	    isLength = requireIsLength();

  	/**
  	 * Checks if `value` is array-like. A value is considered array-like if it's
  	 * not a function and has a `value.length` that's an integer greater than or
  	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 4.0.0
  	 * @category Lang
  	 * @param {*} value The value to check.
  	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
  	 * @example
  	 *
  	 * _.isArrayLike([1, 2, 3]);
  	 * // => true
  	 *
  	 * _.isArrayLike(document.body.children);
  	 * // => true
  	 *
  	 * _.isArrayLike('abc');
  	 * // => true
  	 *
  	 * _.isArrayLike(_.noop);
  	 * // => false
  	 */
  	function isArrayLike(value) {
  	  return value != null && isLength(value.length) && !isFunction(value);
  	}

  	isArrayLike_1 = isArrayLike;
  	return isArrayLike_1;
  }

  var keys_1;
  var hasRequiredKeys;

  function requireKeys () {
  	if (hasRequiredKeys) return keys_1;
  	hasRequiredKeys = 1;
  	var arrayLikeKeys = require_arrayLikeKeys(),
  	    baseKeys = require_baseKeys(),
  	    isArrayLike = requireIsArrayLike();

  	/**
  	 * Creates an array of the own enumerable property names of `object`.
  	 *
  	 * **Note:** Non-object values are coerced to objects. See the
  	 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
  	 * for more details.
  	 *
  	 * @static
  	 * @since 0.1.0
  	 * @memberOf _
  	 * @category Object
  	 * @param {Object} object The object to query.
  	 * @returns {Array} Returns the array of property names.
  	 * @example
  	 *
  	 * function Foo() {
  	 *   this.a = 1;
  	 *   this.b = 2;
  	 * }
  	 *
  	 * Foo.prototype.c = 3;
  	 *
  	 * _.keys(new Foo);
  	 * // => ['a', 'b'] (iteration order is not guaranteed)
  	 *
  	 * _.keys('hi');
  	 * // => ['0', '1']
  	 */
  	function keys(object) {
  	  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  	}

  	keys_1 = keys;
  	return keys_1;
  }

  var _baseAssign;
  var hasRequired_baseAssign;

  function require_baseAssign () {
  	if (hasRequired_baseAssign) return _baseAssign;
  	hasRequired_baseAssign = 1;
  	var copyObject = require_copyObject(),
  	    keys = requireKeys();

  	/**
  	 * The base implementation of `_.assign` without support for multiple sources
  	 * or `customizer` functions.
  	 *
  	 * @private
  	 * @param {Object} object The destination object.
  	 * @param {Object} source The source object.
  	 * @returns {Object} Returns `object`.
  	 */
  	function baseAssign(object, source) {
  	  return object && copyObject(source, keys(source), object);
  	}

  	_baseAssign = baseAssign;
  	return _baseAssign;
  }

  /**
   * This function is like
   * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * except that it includes inherited enumerable properties.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */

  var _nativeKeysIn;
  var hasRequired_nativeKeysIn;

  function require_nativeKeysIn () {
  	if (hasRequired_nativeKeysIn) return _nativeKeysIn;
  	hasRequired_nativeKeysIn = 1;
  	function nativeKeysIn(object) {
  	  var result = [];
  	  if (object != null) {
  	    for (var key in Object(object)) {
  	      result.push(key);
  	    }
  	  }
  	  return result;
  	}

  	_nativeKeysIn = nativeKeysIn;
  	return _nativeKeysIn;
  }

  var _baseKeysIn;
  var hasRequired_baseKeysIn;

  function require_baseKeysIn () {
  	if (hasRequired_baseKeysIn) return _baseKeysIn;
  	hasRequired_baseKeysIn = 1;
  	var isObject = requireIsObject(),
  	    isPrototype = require_isPrototype(),
  	    nativeKeysIn = require_nativeKeysIn();

  	/** Used for built-in method references. */
  	var objectProto = Object.prototype;

  	/** Used to check objects for own properties. */
  	var hasOwnProperty = objectProto.hasOwnProperty;

  	/**
  	 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
  	 *
  	 * @private
  	 * @param {Object} object The object to query.
  	 * @returns {Array} Returns the array of property names.
  	 */
  	function baseKeysIn(object) {
  	  if (!isObject(object)) {
  	    return nativeKeysIn(object);
  	  }
  	  var isProto = isPrototype(object),
  	      result = [];

  	  for (var key in object) {
  	    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
  	      result.push(key);
  	    }
  	  }
  	  return result;
  	}

  	_baseKeysIn = baseKeysIn;
  	return _baseKeysIn;
  }

  var keysIn_1;
  var hasRequiredKeysIn;

  function requireKeysIn () {
  	if (hasRequiredKeysIn) return keysIn_1;
  	hasRequiredKeysIn = 1;
  	var arrayLikeKeys = require_arrayLikeKeys(),
  	    baseKeysIn = require_baseKeysIn(),
  	    isArrayLike = requireIsArrayLike();

  	/**
  	 * Creates an array of the own and inherited enumerable property names of `object`.
  	 *
  	 * **Note:** Non-object values are coerced to objects.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 3.0.0
  	 * @category Object
  	 * @param {Object} object The object to query.
  	 * @returns {Array} Returns the array of property names.
  	 * @example
  	 *
  	 * function Foo() {
  	 *   this.a = 1;
  	 *   this.b = 2;
  	 * }
  	 *
  	 * Foo.prototype.c = 3;
  	 *
  	 * _.keysIn(new Foo);
  	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
  	 */
  	function keysIn(object) {
  	  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
  	}

  	keysIn_1 = keysIn;
  	return keysIn_1;
  }

  var _baseAssignIn;
  var hasRequired_baseAssignIn;

  function require_baseAssignIn () {
  	if (hasRequired_baseAssignIn) return _baseAssignIn;
  	hasRequired_baseAssignIn = 1;
  	var copyObject = require_copyObject(),
  	    keysIn = requireKeysIn();

  	/**
  	 * The base implementation of `_.assignIn` without support for multiple sources
  	 * or `customizer` functions.
  	 *
  	 * @private
  	 * @param {Object} object The destination object.
  	 * @param {Object} source The source object.
  	 * @returns {Object} Returns `object`.
  	 */
  	function baseAssignIn(object, source) {
  	  return object && copyObject(source, keysIn(source), object);
  	}

  	_baseAssignIn = baseAssignIn;
  	return _baseAssignIn;
  }

  var _cloneBuffer = {exports: {}};

  _cloneBuffer.exports;

  var hasRequired_cloneBuffer;

  function require_cloneBuffer () {
  	if (hasRequired_cloneBuffer) return _cloneBuffer.exports;
  	hasRequired_cloneBuffer = 1;
  	(function (module, exports) {
  		var root = require_root();

  		/** Detect free variable `exports`. */
  		var freeExports = exports && !exports.nodeType && exports;

  		/** Detect free variable `module`. */
  		var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

  		/** Detect the popular CommonJS extension `module.exports`. */
  		var moduleExports = freeModule && freeModule.exports === freeExports;

  		/** Built-in value references. */
  		var Buffer = moduleExports ? root.Buffer : undefined,
  		    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

  		/**
  		 * Creates a clone of  `buffer`.
  		 *
  		 * @private
  		 * @param {Buffer} buffer The buffer to clone.
  		 * @param {boolean} [isDeep] Specify a deep clone.
  		 * @returns {Buffer} Returns the cloned buffer.
  		 */
  		function cloneBuffer(buffer, isDeep) {
  		  if (isDeep) {
  		    return buffer.slice();
  		  }
  		  var length = buffer.length,
  		      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  		  buffer.copy(result);
  		  return result;
  		}

  		module.exports = cloneBuffer; 
  	} (_cloneBuffer, _cloneBuffer.exports));
  	return _cloneBuffer.exports;
  }

  /**
   * Copies the values of `source` to `array`.
   *
   * @private
   * @param {Array} source The array to copy values from.
   * @param {Array} [array=[]] The array to copy values to.
   * @returns {Array} Returns `array`.
   */

  var _copyArray;
  var hasRequired_copyArray;

  function require_copyArray () {
  	if (hasRequired_copyArray) return _copyArray;
  	hasRequired_copyArray = 1;
  	function copyArray(source, array) {
  	  var index = -1,
  	      length = source.length;

  	  array || (array = Array(length));
  	  while (++index < length) {
  	    array[index] = source[index];
  	  }
  	  return array;
  	}

  	_copyArray = copyArray;
  	return _copyArray;
  }

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */

  var _arrayFilter;
  var hasRequired_arrayFilter;

  function require_arrayFilter () {
  	if (hasRequired_arrayFilter) return _arrayFilter;
  	hasRequired_arrayFilter = 1;
  	function arrayFilter(array, predicate) {
  	  var index = -1,
  	      length = array == null ? 0 : array.length,
  	      resIndex = 0,
  	      result = [];

  	  while (++index < length) {
  	    var value = array[index];
  	    if (predicate(value, index, array)) {
  	      result[resIndex++] = value;
  	    }
  	  }
  	  return result;
  	}

  	_arrayFilter = arrayFilter;
  	return _arrayFilter;
  }

  /**
   * This method returns a new empty array.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {Array} Returns the new empty array.
   * @example
   *
   * var arrays = _.times(2, _.stubArray);
   *
   * console.log(arrays);
   * // => [[], []]
   *
   * console.log(arrays[0] === arrays[1]);
   * // => false
   */

  var stubArray_1;
  var hasRequiredStubArray;

  function requireStubArray () {
  	if (hasRequiredStubArray) return stubArray_1;
  	hasRequiredStubArray = 1;
  	function stubArray() {
  	  return [];
  	}

  	stubArray_1 = stubArray;
  	return stubArray_1;
  }

  var _getSymbols;
  var hasRequired_getSymbols;

  function require_getSymbols () {
  	if (hasRequired_getSymbols) return _getSymbols;
  	hasRequired_getSymbols = 1;
  	var arrayFilter = require_arrayFilter(),
  	    stubArray = requireStubArray();

  	/** Used for built-in method references. */
  	var objectProto = Object.prototype;

  	/** Built-in value references. */
  	var propertyIsEnumerable = objectProto.propertyIsEnumerable;

  	/* Built-in method references for those with the same name as other `lodash` methods. */
  	var nativeGetSymbols = Object.getOwnPropertySymbols;

  	/**
  	 * Creates an array of the own enumerable symbols of `object`.
  	 *
  	 * @private
  	 * @param {Object} object The object to query.
  	 * @returns {Array} Returns the array of symbols.
  	 */
  	var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  	  if (object == null) {
  	    return [];
  	  }
  	  object = Object(object);
  	  return arrayFilter(nativeGetSymbols(object), function(symbol) {
  	    return propertyIsEnumerable.call(object, symbol);
  	  });
  	};

  	_getSymbols = getSymbols;
  	return _getSymbols;
  }

  var _copySymbols;
  var hasRequired_copySymbols;

  function require_copySymbols () {
  	if (hasRequired_copySymbols) return _copySymbols;
  	hasRequired_copySymbols = 1;
  	var copyObject = require_copyObject(),
  	    getSymbols = require_getSymbols();

  	/**
  	 * Copies own symbols of `source` to `object`.
  	 *
  	 * @private
  	 * @param {Object} source The object to copy symbols from.
  	 * @param {Object} [object={}] The object to copy symbols to.
  	 * @returns {Object} Returns `object`.
  	 */
  	function copySymbols(source, object) {
  	  return copyObject(source, getSymbols(source), object);
  	}

  	_copySymbols = copySymbols;
  	return _copySymbols;
  }

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */

  var _arrayPush;
  var hasRequired_arrayPush;

  function require_arrayPush () {
  	if (hasRequired_arrayPush) return _arrayPush;
  	hasRequired_arrayPush = 1;
  	function arrayPush(array, values) {
  	  var index = -1,
  	      length = values.length,
  	      offset = array.length;

  	  while (++index < length) {
  	    array[offset + index] = values[index];
  	  }
  	  return array;
  	}

  	_arrayPush = arrayPush;
  	return _arrayPush;
  }

  var _getPrototype;
  var hasRequired_getPrototype;

  function require_getPrototype () {
  	if (hasRequired_getPrototype) return _getPrototype;
  	hasRequired_getPrototype = 1;
  	var overArg = require_overArg();

  	/** Built-in value references. */
  	var getPrototype = overArg(Object.getPrototypeOf, Object);

  	_getPrototype = getPrototype;
  	return _getPrototype;
  }

  var _getSymbolsIn;
  var hasRequired_getSymbolsIn;

  function require_getSymbolsIn () {
  	if (hasRequired_getSymbolsIn) return _getSymbolsIn;
  	hasRequired_getSymbolsIn = 1;
  	var arrayPush = require_arrayPush(),
  	    getPrototype = require_getPrototype(),
  	    getSymbols = require_getSymbols(),
  	    stubArray = requireStubArray();

  	/* Built-in method references for those with the same name as other `lodash` methods. */
  	var nativeGetSymbols = Object.getOwnPropertySymbols;

  	/**
  	 * Creates an array of the own and inherited enumerable symbols of `object`.
  	 *
  	 * @private
  	 * @param {Object} object The object to query.
  	 * @returns {Array} Returns the array of symbols.
  	 */
  	var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  	  var result = [];
  	  while (object) {
  	    arrayPush(result, getSymbols(object));
  	    object = getPrototype(object);
  	  }
  	  return result;
  	};

  	_getSymbolsIn = getSymbolsIn;
  	return _getSymbolsIn;
  }

  var _copySymbolsIn;
  var hasRequired_copySymbolsIn;

  function require_copySymbolsIn () {
  	if (hasRequired_copySymbolsIn) return _copySymbolsIn;
  	hasRequired_copySymbolsIn = 1;
  	var copyObject = require_copyObject(),
  	    getSymbolsIn = require_getSymbolsIn();

  	/**
  	 * Copies own and inherited symbols of `source` to `object`.
  	 *
  	 * @private
  	 * @param {Object} source The object to copy symbols from.
  	 * @param {Object} [object={}] The object to copy symbols to.
  	 * @returns {Object} Returns `object`.
  	 */
  	function copySymbolsIn(source, object) {
  	  return copyObject(source, getSymbolsIn(source), object);
  	}

  	_copySymbolsIn = copySymbolsIn;
  	return _copySymbolsIn;
  }

  var _baseGetAllKeys;
  var hasRequired_baseGetAllKeys;

  function require_baseGetAllKeys () {
  	if (hasRequired_baseGetAllKeys) return _baseGetAllKeys;
  	hasRequired_baseGetAllKeys = 1;
  	var arrayPush = require_arrayPush(),
  	    isArray = requireIsArray();

  	/**
  	 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
  	 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
  	 * symbols of `object`.
  	 *
  	 * @private
  	 * @param {Object} object The object to query.
  	 * @param {Function} keysFunc The function to get the keys of `object`.
  	 * @param {Function} symbolsFunc The function to get the symbols of `object`.
  	 * @returns {Array} Returns the array of property names and symbols.
  	 */
  	function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  	  var result = keysFunc(object);
  	  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
  	}

  	_baseGetAllKeys = baseGetAllKeys;
  	return _baseGetAllKeys;
  }

  var _getAllKeys;
  var hasRequired_getAllKeys;

  function require_getAllKeys () {
  	if (hasRequired_getAllKeys) return _getAllKeys;
  	hasRequired_getAllKeys = 1;
  	var baseGetAllKeys = require_baseGetAllKeys(),
  	    getSymbols = require_getSymbols(),
  	    keys = requireKeys();

  	/**
  	 * Creates an array of own enumerable property names and symbols of `object`.
  	 *
  	 * @private
  	 * @param {Object} object The object to query.
  	 * @returns {Array} Returns the array of property names and symbols.
  	 */
  	function getAllKeys(object) {
  	  return baseGetAllKeys(object, keys, getSymbols);
  	}

  	_getAllKeys = getAllKeys;
  	return _getAllKeys;
  }

  var _getAllKeysIn;
  var hasRequired_getAllKeysIn;

  function require_getAllKeysIn () {
  	if (hasRequired_getAllKeysIn) return _getAllKeysIn;
  	hasRequired_getAllKeysIn = 1;
  	var baseGetAllKeys = require_baseGetAllKeys(),
  	    getSymbolsIn = require_getSymbolsIn(),
  	    keysIn = requireKeysIn();

  	/**
  	 * Creates an array of own and inherited enumerable property names and
  	 * symbols of `object`.
  	 *
  	 * @private
  	 * @param {Object} object The object to query.
  	 * @returns {Array} Returns the array of property names and symbols.
  	 */
  	function getAllKeysIn(object) {
  	  return baseGetAllKeys(object, keysIn, getSymbolsIn);
  	}

  	_getAllKeysIn = getAllKeysIn;
  	return _getAllKeysIn;
  }

  var _DataView;
  var hasRequired_DataView;

  function require_DataView () {
  	if (hasRequired_DataView) return _DataView;
  	hasRequired_DataView = 1;
  	var getNative = require_getNative(),
  	    root = require_root();

  	/* Built-in method references that are verified to be native. */
  	var DataView = getNative(root, 'DataView');

  	_DataView = DataView;
  	return _DataView;
  }

  var _Promise;
  var hasRequired_Promise;

  function require_Promise () {
  	if (hasRequired_Promise) return _Promise;
  	hasRequired_Promise = 1;
  	var getNative = require_getNative(),
  	    root = require_root();

  	/* Built-in method references that are verified to be native. */
  	var Promise = getNative(root, 'Promise');

  	_Promise = Promise;
  	return _Promise;
  }

  var _Set;
  var hasRequired_Set;

  function require_Set () {
  	if (hasRequired_Set) return _Set;
  	hasRequired_Set = 1;
  	var getNative = require_getNative(),
  	    root = require_root();

  	/* Built-in method references that are verified to be native. */
  	var Set = getNative(root, 'Set');

  	_Set = Set;
  	return _Set;
  }

  var _WeakMap;
  var hasRequired_WeakMap;

  function require_WeakMap () {
  	if (hasRequired_WeakMap) return _WeakMap;
  	hasRequired_WeakMap = 1;
  	var getNative = require_getNative(),
  	    root = require_root();

  	/* Built-in method references that are verified to be native. */
  	var WeakMap = getNative(root, 'WeakMap');

  	_WeakMap = WeakMap;
  	return _WeakMap;
  }

  var _getTag;
  var hasRequired_getTag;

  function require_getTag () {
  	if (hasRequired_getTag) return _getTag;
  	hasRequired_getTag = 1;
  	var DataView = require_DataView(),
  	    Map = require_Map(),
  	    Promise = require_Promise(),
  	    Set = require_Set(),
  	    WeakMap = require_WeakMap(),
  	    baseGetTag = require_baseGetTag(),
  	    toSource = require_toSource();

  	/** `Object#toString` result references. */
  	var mapTag = '[object Map]',
  	    objectTag = '[object Object]',
  	    promiseTag = '[object Promise]',
  	    setTag = '[object Set]',
  	    weakMapTag = '[object WeakMap]';

  	var dataViewTag = '[object DataView]';

  	/** Used to detect maps, sets, and weakmaps. */
  	var dataViewCtorString = toSource(DataView),
  	    mapCtorString = toSource(Map),
  	    promiseCtorString = toSource(Promise),
  	    setCtorString = toSource(Set),
  	    weakMapCtorString = toSource(WeakMap);

  	/**
  	 * Gets the `toStringTag` of `value`.
  	 *
  	 * @private
  	 * @param {*} value The value to query.
  	 * @returns {string} Returns the `toStringTag`.
  	 */
  	var getTag = baseGetTag;

  	// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
  	if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
  	    (Map && getTag(new Map) != mapTag) ||
  	    (Promise && getTag(Promise.resolve()) != promiseTag) ||
  	    (Set && getTag(new Set) != setTag) ||
  	    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  	  getTag = function(value) {
  	    var result = baseGetTag(value),
  	        Ctor = result == objectTag ? value.constructor : undefined,
  	        ctorString = Ctor ? toSource(Ctor) : '';

  	    if (ctorString) {
  	      switch (ctorString) {
  	        case dataViewCtorString: return dataViewTag;
  	        case mapCtorString: return mapTag;
  	        case promiseCtorString: return promiseTag;
  	        case setCtorString: return setTag;
  	        case weakMapCtorString: return weakMapTag;
  	      }
  	    }
  	    return result;
  	  };
  	}

  	_getTag = getTag;
  	return _getTag;
  }

  /** Used for built-in method references. */

  var _initCloneArray;
  var hasRequired_initCloneArray;

  function require_initCloneArray () {
  	if (hasRequired_initCloneArray) return _initCloneArray;
  	hasRequired_initCloneArray = 1;
  	var objectProto = Object.prototype;

  	/** Used to check objects for own properties. */
  	var hasOwnProperty = objectProto.hasOwnProperty;

  	/**
  	 * Initializes an array clone.
  	 *
  	 * @private
  	 * @param {Array} array The array to clone.
  	 * @returns {Array} Returns the initialized clone.
  	 */
  	function initCloneArray(array) {
  	  var length = array.length,
  	      result = new array.constructor(length);

  	  // Add properties assigned by `RegExp#exec`.
  	  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
  	    result.index = array.index;
  	    result.input = array.input;
  	  }
  	  return result;
  	}

  	_initCloneArray = initCloneArray;
  	return _initCloneArray;
  }

  var _Uint8Array;
  var hasRequired_Uint8Array;

  function require_Uint8Array () {
  	if (hasRequired_Uint8Array) return _Uint8Array;
  	hasRequired_Uint8Array = 1;
  	var root = require_root();

  	/** Built-in value references. */
  	var Uint8Array = root.Uint8Array;

  	_Uint8Array = Uint8Array;
  	return _Uint8Array;
  }

  var _cloneArrayBuffer;
  var hasRequired_cloneArrayBuffer;

  function require_cloneArrayBuffer () {
  	if (hasRequired_cloneArrayBuffer) return _cloneArrayBuffer;
  	hasRequired_cloneArrayBuffer = 1;
  	var Uint8Array = require_Uint8Array();

  	/**
  	 * Creates a clone of `arrayBuffer`.
  	 *
  	 * @private
  	 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
  	 * @returns {ArrayBuffer} Returns the cloned array buffer.
  	 */
  	function cloneArrayBuffer(arrayBuffer) {
  	  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  	  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  	  return result;
  	}

  	_cloneArrayBuffer = cloneArrayBuffer;
  	return _cloneArrayBuffer;
  }

  var _cloneDataView;
  var hasRequired_cloneDataView;

  function require_cloneDataView () {
  	if (hasRequired_cloneDataView) return _cloneDataView;
  	hasRequired_cloneDataView = 1;
  	var cloneArrayBuffer = require_cloneArrayBuffer();

  	/**
  	 * Creates a clone of `dataView`.
  	 *
  	 * @private
  	 * @param {Object} dataView The data view to clone.
  	 * @param {boolean} [isDeep] Specify a deep clone.
  	 * @returns {Object} Returns the cloned data view.
  	 */
  	function cloneDataView(dataView, isDeep) {
  	  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  	  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
  	}

  	_cloneDataView = cloneDataView;
  	return _cloneDataView;
  }

  /** Used to match `RegExp` flags from their coerced string values. */

  var _cloneRegExp;
  var hasRequired_cloneRegExp;

  function require_cloneRegExp () {
  	if (hasRequired_cloneRegExp) return _cloneRegExp;
  	hasRequired_cloneRegExp = 1;
  	var reFlags = /\w*$/;

  	/**
  	 * Creates a clone of `regexp`.
  	 *
  	 * @private
  	 * @param {Object} regexp The regexp to clone.
  	 * @returns {Object} Returns the cloned regexp.
  	 */
  	function cloneRegExp(regexp) {
  	  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  	  result.lastIndex = regexp.lastIndex;
  	  return result;
  	}

  	_cloneRegExp = cloneRegExp;
  	return _cloneRegExp;
  }

  var _cloneSymbol;
  var hasRequired_cloneSymbol;

  function require_cloneSymbol () {
  	if (hasRequired_cloneSymbol) return _cloneSymbol;
  	hasRequired_cloneSymbol = 1;
  	var Symbol = require_Symbol();

  	/** Used to convert symbols to primitives and strings. */
  	var symbolProto = Symbol ? Symbol.prototype : undefined,
  	    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

  	/**
  	 * Creates a clone of the `symbol` object.
  	 *
  	 * @private
  	 * @param {Object} symbol The symbol object to clone.
  	 * @returns {Object} Returns the cloned symbol object.
  	 */
  	function cloneSymbol(symbol) {
  	  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
  	}

  	_cloneSymbol = cloneSymbol;
  	return _cloneSymbol;
  }

  var _cloneTypedArray;
  var hasRequired_cloneTypedArray;

  function require_cloneTypedArray () {
  	if (hasRequired_cloneTypedArray) return _cloneTypedArray;
  	hasRequired_cloneTypedArray = 1;
  	var cloneArrayBuffer = require_cloneArrayBuffer();

  	/**
  	 * Creates a clone of `typedArray`.
  	 *
  	 * @private
  	 * @param {Object} typedArray The typed array to clone.
  	 * @param {boolean} [isDeep] Specify a deep clone.
  	 * @returns {Object} Returns the cloned typed array.
  	 */
  	function cloneTypedArray(typedArray, isDeep) {
  	  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  	  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  	}

  	_cloneTypedArray = cloneTypedArray;
  	return _cloneTypedArray;
  }

  var _initCloneByTag;
  var hasRequired_initCloneByTag;

  function require_initCloneByTag () {
  	if (hasRequired_initCloneByTag) return _initCloneByTag;
  	hasRequired_initCloneByTag = 1;
  	var cloneArrayBuffer = require_cloneArrayBuffer(),
  	    cloneDataView = require_cloneDataView(),
  	    cloneRegExp = require_cloneRegExp(),
  	    cloneSymbol = require_cloneSymbol(),
  	    cloneTypedArray = require_cloneTypedArray();

  	/** `Object#toString` result references. */
  	var boolTag = '[object Boolean]',
  	    dateTag = '[object Date]',
  	    mapTag = '[object Map]',
  	    numberTag = '[object Number]',
  	    regexpTag = '[object RegExp]',
  	    setTag = '[object Set]',
  	    stringTag = '[object String]',
  	    symbolTag = '[object Symbol]';

  	var arrayBufferTag = '[object ArrayBuffer]',
  	    dataViewTag = '[object DataView]',
  	    float32Tag = '[object Float32Array]',
  	    float64Tag = '[object Float64Array]',
  	    int8Tag = '[object Int8Array]',
  	    int16Tag = '[object Int16Array]',
  	    int32Tag = '[object Int32Array]',
  	    uint8Tag = '[object Uint8Array]',
  	    uint8ClampedTag = '[object Uint8ClampedArray]',
  	    uint16Tag = '[object Uint16Array]',
  	    uint32Tag = '[object Uint32Array]';

  	/**
  	 * Initializes an object clone based on its `toStringTag`.
  	 *
  	 * **Note:** This function only supports cloning values with tags of
  	 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
  	 *
  	 * @private
  	 * @param {Object} object The object to clone.
  	 * @param {string} tag The `toStringTag` of the object to clone.
  	 * @param {boolean} [isDeep] Specify a deep clone.
  	 * @returns {Object} Returns the initialized clone.
  	 */
  	function initCloneByTag(object, tag, isDeep) {
  	  var Ctor = object.constructor;
  	  switch (tag) {
  	    case arrayBufferTag:
  	      return cloneArrayBuffer(object);

  	    case boolTag:
  	    case dateTag:
  	      return new Ctor(+object);

  	    case dataViewTag:
  	      return cloneDataView(object, isDeep);

  	    case float32Tag: case float64Tag:
  	    case int8Tag: case int16Tag: case int32Tag:
  	    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
  	      return cloneTypedArray(object, isDeep);

  	    case mapTag:
  	      return new Ctor;

  	    case numberTag:
  	    case stringTag:
  	      return new Ctor(object);

  	    case regexpTag:
  	      return cloneRegExp(object);

  	    case setTag:
  	      return new Ctor;

  	    case symbolTag:
  	      return cloneSymbol(object);
  	  }
  	}

  	_initCloneByTag = initCloneByTag;
  	return _initCloneByTag;
  }

  var _baseCreate;
  var hasRequired_baseCreate;

  function require_baseCreate () {
  	if (hasRequired_baseCreate) return _baseCreate;
  	hasRequired_baseCreate = 1;
  	var isObject = requireIsObject();

  	/** Built-in value references. */
  	var objectCreate = Object.create;

  	/**
  	 * The base implementation of `_.create` without support for assigning
  	 * properties to the created object.
  	 *
  	 * @private
  	 * @param {Object} proto The object to inherit from.
  	 * @returns {Object} Returns the new object.
  	 */
  	var baseCreate = (function() {
  	  function object() {}
  	  return function(proto) {
  	    if (!isObject(proto)) {
  	      return {};
  	    }
  	    if (objectCreate) {
  	      return objectCreate(proto);
  	    }
  	    object.prototype = proto;
  	    var result = new object;
  	    object.prototype = undefined;
  	    return result;
  	  };
  	}());

  	_baseCreate = baseCreate;
  	return _baseCreate;
  }

  var _initCloneObject;
  var hasRequired_initCloneObject;

  function require_initCloneObject () {
  	if (hasRequired_initCloneObject) return _initCloneObject;
  	hasRequired_initCloneObject = 1;
  	var baseCreate = require_baseCreate(),
  	    getPrototype = require_getPrototype(),
  	    isPrototype = require_isPrototype();

  	/**
  	 * Initializes an object clone.
  	 *
  	 * @private
  	 * @param {Object} object The object to clone.
  	 * @returns {Object} Returns the initialized clone.
  	 */
  	function initCloneObject(object) {
  	  return (typeof object.constructor == 'function' && !isPrototype(object))
  	    ? baseCreate(getPrototype(object))
  	    : {};
  	}

  	_initCloneObject = initCloneObject;
  	return _initCloneObject;
  }

  var _baseIsMap;
  var hasRequired_baseIsMap;

  function require_baseIsMap () {
  	if (hasRequired_baseIsMap) return _baseIsMap;
  	hasRequired_baseIsMap = 1;
  	var getTag = require_getTag(),
  	    isObjectLike = requireIsObjectLike();

  	/** `Object#toString` result references. */
  	var mapTag = '[object Map]';

  	/**
  	 * The base implementation of `_.isMap` without Node.js optimizations.
  	 *
  	 * @private
  	 * @param {*} value The value to check.
  	 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
  	 */
  	function baseIsMap(value) {
  	  return isObjectLike(value) && getTag(value) == mapTag;
  	}

  	_baseIsMap = baseIsMap;
  	return _baseIsMap;
  }

  var isMap_1;
  var hasRequiredIsMap;

  function requireIsMap () {
  	if (hasRequiredIsMap) return isMap_1;
  	hasRequiredIsMap = 1;
  	var baseIsMap = require_baseIsMap(),
  	    baseUnary = require_baseUnary(),
  	    nodeUtil = require_nodeUtil();

  	/* Node.js helper references. */
  	var nodeIsMap = nodeUtil && nodeUtil.isMap;

  	/**
  	 * Checks if `value` is classified as a `Map` object.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 4.3.0
  	 * @category Lang
  	 * @param {*} value The value to check.
  	 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
  	 * @example
  	 *
  	 * _.isMap(new Map);
  	 * // => true
  	 *
  	 * _.isMap(new WeakMap);
  	 * // => false
  	 */
  	var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

  	isMap_1 = isMap;
  	return isMap_1;
  }

  var _baseIsSet;
  var hasRequired_baseIsSet;

  function require_baseIsSet () {
  	if (hasRequired_baseIsSet) return _baseIsSet;
  	hasRequired_baseIsSet = 1;
  	var getTag = require_getTag(),
  	    isObjectLike = requireIsObjectLike();

  	/** `Object#toString` result references. */
  	var setTag = '[object Set]';

  	/**
  	 * The base implementation of `_.isSet` without Node.js optimizations.
  	 *
  	 * @private
  	 * @param {*} value The value to check.
  	 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
  	 */
  	function baseIsSet(value) {
  	  return isObjectLike(value) && getTag(value) == setTag;
  	}

  	_baseIsSet = baseIsSet;
  	return _baseIsSet;
  }

  var isSet_1;
  var hasRequiredIsSet;

  function requireIsSet () {
  	if (hasRequiredIsSet) return isSet_1;
  	hasRequiredIsSet = 1;
  	var baseIsSet = require_baseIsSet(),
  	    baseUnary = require_baseUnary(),
  	    nodeUtil = require_nodeUtil();

  	/* Node.js helper references. */
  	var nodeIsSet = nodeUtil && nodeUtil.isSet;

  	/**
  	 * Checks if `value` is classified as a `Set` object.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 4.3.0
  	 * @category Lang
  	 * @param {*} value The value to check.
  	 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
  	 * @example
  	 *
  	 * _.isSet(new Set);
  	 * // => true
  	 *
  	 * _.isSet(new WeakSet);
  	 * // => false
  	 */
  	var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

  	isSet_1 = isSet;
  	return isSet_1;
  }

  var _baseClone;
  var hasRequired_baseClone;

  function require_baseClone () {
  	if (hasRequired_baseClone) return _baseClone;
  	hasRequired_baseClone = 1;
  	var Stack = require_Stack(),
  	    arrayEach = require_arrayEach(),
  	    assignValue = require_assignValue(),
  	    baseAssign = require_baseAssign(),
  	    baseAssignIn = require_baseAssignIn(),
  	    cloneBuffer = require_cloneBuffer(),
  	    copyArray = require_copyArray(),
  	    copySymbols = require_copySymbols(),
  	    copySymbolsIn = require_copySymbolsIn(),
  	    getAllKeys = require_getAllKeys(),
  	    getAllKeysIn = require_getAllKeysIn(),
  	    getTag = require_getTag(),
  	    initCloneArray = require_initCloneArray(),
  	    initCloneByTag = require_initCloneByTag(),
  	    initCloneObject = require_initCloneObject(),
  	    isArray = requireIsArray(),
  	    isBuffer = requireIsBuffer(),
  	    isMap = requireIsMap(),
  	    isObject = requireIsObject(),
  	    isSet = requireIsSet(),
  	    keys = requireKeys(),
  	    keysIn = requireKeysIn();

  	/** Used to compose bitmasks for cloning. */
  	var CLONE_DEEP_FLAG = 1,
  	    CLONE_FLAT_FLAG = 2,
  	    CLONE_SYMBOLS_FLAG = 4;

  	/** `Object#toString` result references. */
  	var argsTag = '[object Arguments]',
  	    arrayTag = '[object Array]',
  	    boolTag = '[object Boolean]',
  	    dateTag = '[object Date]',
  	    errorTag = '[object Error]',
  	    funcTag = '[object Function]',
  	    genTag = '[object GeneratorFunction]',
  	    mapTag = '[object Map]',
  	    numberTag = '[object Number]',
  	    objectTag = '[object Object]',
  	    regexpTag = '[object RegExp]',
  	    setTag = '[object Set]',
  	    stringTag = '[object String]',
  	    symbolTag = '[object Symbol]',
  	    weakMapTag = '[object WeakMap]';

  	var arrayBufferTag = '[object ArrayBuffer]',
  	    dataViewTag = '[object DataView]',
  	    float32Tag = '[object Float32Array]',
  	    float64Tag = '[object Float64Array]',
  	    int8Tag = '[object Int8Array]',
  	    int16Tag = '[object Int16Array]',
  	    int32Tag = '[object Int32Array]',
  	    uint8Tag = '[object Uint8Array]',
  	    uint8ClampedTag = '[object Uint8ClampedArray]',
  	    uint16Tag = '[object Uint16Array]',
  	    uint32Tag = '[object Uint32Array]';

  	/** Used to identify `toStringTag` values supported by `_.clone`. */
  	var cloneableTags = {};
  	cloneableTags[argsTag] = cloneableTags[arrayTag] =
  	cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
  	cloneableTags[boolTag] = cloneableTags[dateTag] =
  	cloneableTags[float32Tag] = cloneableTags[float64Tag] =
  	cloneableTags[int8Tag] = cloneableTags[int16Tag] =
  	cloneableTags[int32Tag] = cloneableTags[mapTag] =
  	cloneableTags[numberTag] = cloneableTags[objectTag] =
  	cloneableTags[regexpTag] = cloneableTags[setTag] =
  	cloneableTags[stringTag] = cloneableTags[symbolTag] =
  	cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
  	cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  	cloneableTags[errorTag] = cloneableTags[funcTag] =
  	cloneableTags[weakMapTag] = false;

  	/**
  	 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
  	 * traversed objects.
  	 *
  	 * @private
  	 * @param {*} value The value to clone.
  	 * @param {boolean} bitmask The bitmask flags.
  	 *  1 - Deep clone
  	 *  2 - Flatten inherited properties
  	 *  4 - Clone symbols
  	 * @param {Function} [customizer] The function to customize cloning.
  	 * @param {string} [key] The key of `value`.
  	 * @param {Object} [object] The parent object of `value`.
  	 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
  	 * @returns {*} Returns the cloned value.
  	 */
  	function baseClone(value, bitmask, customizer, key, object, stack) {
  	  var result,
  	      isDeep = bitmask & CLONE_DEEP_FLAG,
  	      isFlat = bitmask & CLONE_FLAT_FLAG,
  	      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  	  if (customizer) {
  	    result = object ? customizer(value, key, object, stack) : customizer(value);
  	  }
  	  if (result !== undefined) {
  	    return result;
  	  }
  	  if (!isObject(value)) {
  	    return value;
  	  }
  	  var isArr = isArray(value);
  	  if (isArr) {
  	    result = initCloneArray(value);
  	    if (!isDeep) {
  	      return copyArray(value, result);
  	    }
  	  } else {
  	    var tag = getTag(value),
  	        isFunc = tag == funcTag || tag == genTag;

  	    if (isBuffer(value)) {
  	      return cloneBuffer(value, isDeep);
  	    }
  	    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
  	      result = (isFlat || isFunc) ? {} : initCloneObject(value);
  	      if (!isDeep) {
  	        return isFlat
  	          ? copySymbolsIn(value, baseAssignIn(result, value))
  	          : copySymbols(value, baseAssign(result, value));
  	      }
  	    } else {
  	      if (!cloneableTags[tag]) {
  	        return object ? value : {};
  	      }
  	      result = initCloneByTag(value, tag, isDeep);
  	    }
  	  }
  	  // Check for circular references and return its corresponding clone.
  	  stack || (stack = new Stack);
  	  var stacked = stack.get(value);
  	  if (stacked) {
  	    return stacked;
  	  }
  	  stack.set(value, result);

  	  if (isSet(value)) {
  	    value.forEach(function(subValue) {
  	      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
  	    });
  	  } else if (isMap(value)) {
  	    value.forEach(function(subValue, key) {
  	      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
  	    });
  	  }

  	  var keysFunc = isFull
  	    ? (isFlat ? getAllKeysIn : getAllKeys)
  	    : (isFlat ? keysIn : keys);

  	  var props = isArr ? undefined : keysFunc(value);
  	  arrayEach(props || value, function(subValue, key) {
  	    if (props) {
  	      key = subValue;
  	      subValue = value[key];
  	    }
  	    // Recursively populate clone (susceptible to call stack limits).
  	    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  	  });
  	  return result;
  	}

  	_baseClone = baseClone;
  	return _baseClone;
  }

  var clone_1;
  var hasRequiredClone;

  function requireClone () {
  	if (hasRequiredClone) return clone_1;
  	hasRequiredClone = 1;
  	var baseClone = require_baseClone();

  	/** Used to compose bitmasks for cloning. */
  	var CLONE_SYMBOLS_FLAG = 4;

  	/**
  	 * Creates a shallow clone of `value`.
  	 *
  	 * **Note:** This method is loosely based on the
  	 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
  	 * and supports cloning arrays, array buffers, booleans, date objects, maps,
  	 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
  	 * arrays. The own enumerable properties of `arguments` objects are cloned
  	 * as plain objects. An empty object is returned for uncloneable values such
  	 * as error objects, functions, DOM nodes, and WeakMaps.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 0.1.0
  	 * @category Lang
  	 * @param {*} value The value to clone.
  	 * @returns {*} Returns the cloned value.
  	 * @see _.cloneDeep
  	 * @example
  	 *
  	 * var objects = [{ 'a': 1 }, { 'b': 2 }];
  	 *
  	 * var shallow = _.clone(objects);
  	 * console.log(shallow[0] === objects[0]);
  	 * // => true
  	 */
  	function clone(value) {
  	  return baseClone(value, CLONE_SYMBOLS_FLAG);
  	}

  	clone_1 = clone;
  	return clone_1;
  }

  /**
   * Creates a function that returns `value`.
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Util
   * @param {*} value The value to return from the new function.
   * @returns {Function} Returns the new constant function.
   * @example
   *
   * var objects = _.times(2, _.constant({ 'a': 1 }));
   *
   * console.log(objects);
   * // => [{ 'a': 1 }, { 'a': 1 }]
   *
   * console.log(objects[0] === objects[1]);
   * // => true
   */

  var constant_1;
  var hasRequiredConstant;

  function requireConstant () {
  	if (hasRequiredConstant) return constant_1;
  	hasRequiredConstant = 1;
  	function constant(value) {
  	  return function() {
  	    return value;
  	  };
  	}

  	constant_1 = constant;
  	return constant_1;
  }

  /**
   * Creates a base function for methods like `_.forIn` and `_.forOwn`.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */

  var _createBaseFor;
  var hasRequired_createBaseFor;

  function require_createBaseFor () {
  	if (hasRequired_createBaseFor) return _createBaseFor;
  	hasRequired_createBaseFor = 1;
  	function createBaseFor(fromRight) {
  	  return function(object, iteratee, keysFunc) {
  	    var index = -1,
  	        iterable = Object(object),
  	        props = keysFunc(object),
  	        length = props.length;

  	    while (length--) {
  	      var key = props[fromRight ? length : ++index];
  	      if (iteratee(iterable[key], key, iterable) === false) {
  	        break;
  	      }
  	    }
  	    return object;
  	  };
  	}

  	_createBaseFor = createBaseFor;
  	return _createBaseFor;
  }

  var _baseFor;
  var hasRequired_baseFor;

  function require_baseFor () {
  	if (hasRequired_baseFor) return _baseFor;
  	hasRequired_baseFor = 1;
  	var createBaseFor = require_createBaseFor();

  	/**
  	 * The base implementation of `baseForOwn` which iterates over `object`
  	 * properties returned by `keysFunc` and invokes `iteratee` for each property.
  	 * Iteratee functions may exit iteration early by explicitly returning `false`.
  	 *
  	 * @private
  	 * @param {Object} object The object to iterate over.
  	 * @param {Function} iteratee The function invoked per iteration.
  	 * @param {Function} keysFunc The function to get the keys of `object`.
  	 * @returns {Object} Returns `object`.
  	 */
  	var baseFor = createBaseFor();

  	_baseFor = baseFor;
  	return _baseFor;
  }

  var _baseForOwn;
  var hasRequired_baseForOwn;

  function require_baseForOwn () {
  	if (hasRequired_baseForOwn) return _baseForOwn;
  	hasRequired_baseForOwn = 1;
  	var baseFor = require_baseFor(),
  	    keys = requireKeys();

  	/**
  	 * The base implementation of `_.forOwn` without support for iteratee shorthands.
  	 *
  	 * @private
  	 * @param {Object} object The object to iterate over.
  	 * @param {Function} iteratee The function invoked per iteration.
  	 * @returns {Object} Returns `object`.
  	 */
  	function baseForOwn(object, iteratee) {
  	  return object && baseFor(object, iteratee, keys);
  	}

  	_baseForOwn = baseForOwn;
  	return _baseForOwn;
  }

  var _createBaseEach;
  var hasRequired_createBaseEach;

  function require_createBaseEach () {
  	if (hasRequired_createBaseEach) return _createBaseEach;
  	hasRequired_createBaseEach = 1;
  	var isArrayLike = requireIsArrayLike();

  	/**
  	 * Creates a `baseEach` or `baseEachRight` function.
  	 *
  	 * @private
  	 * @param {Function} eachFunc The function to iterate over a collection.
  	 * @param {boolean} [fromRight] Specify iterating from right to left.
  	 * @returns {Function} Returns the new base function.
  	 */
  	function createBaseEach(eachFunc, fromRight) {
  	  return function(collection, iteratee) {
  	    if (collection == null) {
  	      return collection;
  	    }
  	    if (!isArrayLike(collection)) {
  	      return eachFunc(collection, iteratee);
  	    }
  	    var length = collection.length,
  	        index = fromRight ? length : -1,
  	        iterable = Object(collection);

  	    while ((fromRight ? index-- : ++index < length)) {
  	      if (iteratee(iterable[index], index, iterable) === false) {
  	        break;
  	      }
  	    }
  	    return collection;
  	  };
  	}

  	_createBaseEach = createBaseEach;
  	return _createBaseEach;
  }

  var _baseEach;
  var hasRequired_baseEach;

  function require_baseEach () {
  	if (hasRequired_baseEach) return _baseEach;
  	hasRequired_baseEach = 1;
  	var baseForOwn = require_baseForOwn(),
  	    createBaseEach = require_createBaseEach();

  	/**
  	 * The base implementation of `_.forEach` without support for iteratee shorthands.
  	 *
  	 * @private
  	 * @param {Array|Object} collection The collection to iterate over.
  	 * @param {Function} iteratee The function invoked per iteration.
  	 * @returns {Array|Object} Returns `collection`.
  	 */
  	var baseEach = createBaseEach(baseForOwn);

  	_baseEach = baseEach;
  	return _baseEach;
  }

  /**
   * This method returns the first argument it receives.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'a': 1 };
   *
   * console.log(_.identity(object) === object);
   * // => true
   */

  var identity_1;
  var hasRequiredIdentity;

  function requireIdentity () {
  	if (hasRequiredIdentity) return identity_1;
  	hasRequiredIdentity = 1;
  	function identity(value) {
  	  return value;
  	}

  	identity_1 = identity;
  	return identity_1;
  }

  var _castFunction;
  var hasRequired_castFunction;

  function require_castFunction () {
  	if (hasRequired_castFunction) return _castFunction;
  	hasRequired_castFunction = 1;
  	var identity = requireIdentity();

  	/**
  	 * Casts `value` to `identity` if it's not a function.
  	 *
  	 * @private
  	 * @param {*} value The value to inspect.
  	 * @returns {Function} Returns cast function.
  	 */
  	function castFunction(value) {
  	  return typeof value == 'function' ? value : identity;
  	}

  	_castFunction = castFunction;
  	return _castFunction;
  }

  var forEach_1;
  var hasRequiredForEach;

  function requireForEach () {
  	if (hasRequiredForEach) return forEach_1;
  	hasRequiredForEach = 1;
  	var arrayEach = require_arrayEach(),
  	    baseEach = require_baseEach(),
  	    castFunction = require_castFunction(),
  	    isArray = requireIsArray();

  	/**
  	 * Iterates over elements of `collection` and invokes `iteratee` for each element.
  	 * The iteratee is invoked with three arguments: (value, index|key, collection).
  	 * Iteratee functions may exit iteration early by explicitly returning `false`.
  	 *
  	 * **Note:** As with other "Collections" methods, objects with a "length"
  	 * property are iterated like arrays. To avoid this behavior use `_.forIn`
  	 * or `_.forOwn` for object iteration.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 0.1.0
  	 * @alias each
  	 * @category Collection
  	 * @param {Array|Object} collection The collection to iterate over.
  	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
  	 * @returns {Array|Object} Returns `collection`.
  	 * @see _.forEachRight
  	 * @example
  	 *
  	 * _.forEach([1, 2], function(value) {
  	 *   console.log(value);
  	 * });
  	 * // => Logs `1` then `2`.
  	 *
  	 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
  	 *   console.log(key);
  	 * });
  	 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
  	 */
  	function forEach(collection, iteratee) {
  	  var func = isArray(collection) ? arrayEach : baseEach;
  	  return func(collection, castFunction(iteratee));
  	}

  	forEach_1 = forEach;
  	return forEach_1;
  }

  var each;
  var hasRequiredEach;

  function requireEach () {
  	if (hasRequiredEach) return each;
  	hasRequiredEach = 1;
  	each = requireForEach();
  	return each;
  }

  var _baseFilter;
  var hasRequired_baseFilter;

  function require_baseFilter () {
  	if (hasRequired_baseFilter) return _baseFilter;
  	hasRequired_baseFilter = 1;
  	var baseEach = require_baseEach();

  	/**
  	 * The base implementation of `_.filter` without support for iteratee shorthands.
  	 *
  	 * @private
  	 * @param {Array|Object} collection The collection to iterate over.
  	 * @param {Function} predicate The function invoked per iteration.
  	 * @returns {Array} Returns the new filtered array.
  	 */
  	function baseFilter(collection, predicate) {
  	  var result = [];
  	  baseEach(collection, function(value, index, collection) {
  	    if (predicate(value, index, collection)) {
  	      result.push(value);
  	    }
  	  });
  	  return result;
  	}

  	_baseFilter = baseFilter;
  	return _baseFilter;
  }

  /** Used to stand-in for `undefined` hash values. */

  var _setCacheAdd;
  var hasRequired_setCacheAdd;

  function require_setCacheAdd () {
  	if (hasRequired_setCacheAdd) return _setCacheAdd;
  	hasRequired_setCacheAdd = 1;
  	var HASH_UNDEFINED = '__lodash_hash_undefined__';

  	/**
  	 * Adds `value` to the array cache.
  	 *
  	 * @private
  	 * @name add
  	 * @memberOf SetCache
  	 * @alias push
  	 * @param {*} value The value to cache.
  	 * @returns {Object} Returns the cache instance.
  	 */
  	function setCacheAdd(value) {
  	  this.__data__.set(value, HASH_UNDEFINED);
  	  return this;
  	}

  	_setCacheAdd = setCacheAdd;
  	return _setCacheAdd;
  }

  /**
   * Checks if `value` is in the array cache.
   *
   * @private
   * @name has
   * @memberOf SetCache
   * @param {*} value The value to search for.
   * @returns {number} Returns `true` if `value` is found, else `false`.
   */

  var _setCacheHas;
  var hasRequired_setCacheHas;

  function require_setCacheHas () {
  	if (hasRequired_setCacheHas) return _setCacheHas;
  	hasRequired_setCacheHas = 1;
  	function setCacheHas(value) {
  	  return this.__data__.has(value);
  	}

  	_setCacheHas = setCacheHas;
  	return _setCacheHas;
  }

  var _SetCache;
  var hasRequired_SetCache;

  function require_SetCache () {
  	if (hasRequired_SetCache) return _SetCache;
  	hasRequired_SetCache = 1;
  	var MapCache = require_MapCache(),
  	    setCacheAdd = require_setCacheAdd(),
  	    setCacheHas = require_setCacheHas();

  	/**
  	 *
  	 * Creates an array cache object to store unique values.
  	 *
  	 * @private
  	 * @constructor
  	 * @param {Array} [values] The values to cache.
  	 */
  	function SetCache(values) {
  	  var index = -1,
  	      length = values == null ? 0 : values.length;

  	  this.__data__ = new MapCache;
  	  while (++index < length) {
  	    this.add(values[index]);
  	  }
  	}

  	// Add methods to `SetCache`.
  	SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
  	SetCache.prototype.has = setCacheHas;

  	_SetCache = SetCache;
  	return _SetCache;
  }

  /**
   * A specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */

  var _arraySome;
  var hasRequired_arraySome;

  function require_arraySome () {
  	if (hasRequired_arraySome) return _arraySome;
  	hasRequired_arraySome = 1;
  	function arraySome(array, predicate) {
  	  var index = -1,
  	      length = array == null ? 0 : array.length;

  	  while (++index < length) {
  	    if (predicate(array[index], index, array)) {
  	      return true;
  	    }
  	  }
  	  return false;
  	}

  	_arraySome = arraySome;
  	return _arraySome;
  }

  /**
   * Checks if a `cache` value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */

  var _cacheHas;
  var hasRequired_cacheHas;

  function require_cacheHas () {
  	if (hasRequired_cacheHas) return _cacheHas;
  	hasRequired_cacheHas = 1;
  	function cacheHas(cache, key) {
  	  return cache.has(key);
  	}

  	_cacheHas = cacheHas;
  	return _cacheHas;
  }

  var _equalArrays;
  var hasRequired_equalArrays;

  function require_equalArrays () {
  	if (hasRequired_equalArrays) return _equalArrays;
  	hasRequired_equalArrays = 1;
  	var SetCache = require_SetCache(),
  	    arraySome = require_arraySome(),
  	    cacheHas = require_cacheHas();

  	/** Used to compose bitmasks for value comparisons. */
  	var COMPARE_PARTIAL_FLAG = 1,
  	    COMPARE_UNORDERED_FLAG = 2;

  	/**
  	 * A specialized version of `baseIsEqualDeep` for arrays with support for
  	 * partial deep comparisons.
  	 *
  	 * @private
  	 * @param {Array} array The array to compare.
  	 * @param {Array} other The other array to compare.
  	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
  	 * @param {Function} customizer The function to customize comparisons.
  	 * @param {Function} equalFunc The function to determine equivalents of values.
  	 * @param {Object} stack Tracks traversed `array` and `other` objects.
  	 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
  	 */
  	function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  	  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
  	      arrLength = array.length,
  	      othLength = other.length;

  	  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
  	    return false;
  	  }
  	  // Check that cyclic values are equal.
  	  var arrStacked = stack.get(array);
  	  var othStacked = stack.get(other);
  	  if (arrStacked && othStacked) {
  	    return arrStacked == other && othStacked == array;
  	  }
  	  var index = -1,
  	      result = true,
  	      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  	  stack.set(array, other);
  	  stack.set(other, array);

  	  // Ignore non-index properties.
  	  while (++index < arrLength) {
  	    var arrValue = array[index],
  	        othValue = other[index];

  	    if (customizer) {
  	      var compared = isPartial
  	        ? customizer(othValue, arrValue, index, other, array, stack)
  	        : customizer(arrValue, othValue, index, array, other, stack);
  	    }
  	    if (compared !== undefined) {
  	      if (compared) {
  	        continue;
  	      }
  	      result = false;
  	      break;
  	    }
  	    // Recursively compare arrays (susceptible to call stack limits).
  	    if (seen) {
  	      if (!arraySome(other, function(othValue, othIndex) {
  	            if (!cacheHas(seen, othIndex) &&
  	                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
  	              return seen.push(othIndex);
  	            }
  	          })) {
  	        result = false;
  	        break;
  	      }
  	    } else if (!(
  	          arrValue === othValue ||
  	            equalFunc(arrValue, othValue, bitmask, customizer, stack)
  	        )) {
  	      result = false;
  	      break;
  	    }
  	  }
  	  stack['delete'](array);
  	  stack['delete'](other);
  	  return result;
  	}

  	_equalArrays = equalArrays;
  	return _equalArrays;
  }

  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */

  var _mapToArray;
  var hasRequired_mapToArray;

  function require_mapToArray () {
  	if (hasRequired_mapToArray) return _mapToArray;
  	hasRequired_mapToArray = 1;
  	function mapToArray(map) {
  	  var index = -1,
  	      result = Array(map.size);

  	  map.forEach(function(value, key) {
  	    result[++index] = [key, value];
  	  });
  	  return result;
  	}

  	_mapToArray = mapToArray;
  	return _mapToArray;
  }

  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */

  var _setToArray;
  var hasRequired_setToArray;

  function require_setToArray () {
  	if (hasRequired_setToArray) return _setToArray;
  	hasRequired_setToArray = 1;
  	function setToArray(set) {
  	  var index = -1,
  	      result = Array(set.size);

  	  set.forEach(function(value) {
  	    result[++index] = value;
  	  });
  	  return result;
  	}

  	_setToArray = setToArray;
  	return _setToArray;
  }

  var _equalByTag;
  var hasRequired_equalByTag;

  function require_equalByTag () {
  	if (hasRequired_equalByTag) return _equalByTag;
  	hasRequired_equalByTag = 1;
  	var Symbol = require_Symbol(),
  	    Uint8Array = require_Uint8Array(),
  	    eq = requireEq(),
  	    equalArrays = require_equalArrays(),
  	    mapToArray = require_mapToArray(),
  	    setToArray = require_setToArray();

  	/** Used to compose bitmasks for value comparisons. */
  	var COMPARE_PARTIAL_FLAG = 1,
  	    COMPARE_UNORDERED_FLAG = 2;

  	/** `Object#toString` result references. */
  	var boolTag = '[object Boolean]',
  	    dateTag = '[object Date]',
  	    errorTag = '[object Error]',
  	    mapTag = '[object Map]',
  	    numberTag = '[object Number]',
  	    regexpTag = '[object RegExp]',
  	    setTag = '[object Set]',
  	    stringTag = '[object String]',
  	    symbolTag = '[object Symbol]';

  	var arrayBufferTag = '[object ArrayBuffer]',
  	    dataViewTag = '[object DataView]';

  	/** Used to convert symbols to primitives and strings. */
  	var symbolProto = Symbol ? Symbol.prototype : undefined,
  	    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

  	/**
  	 * A specialized version of `baseIsEqualDeep` for comparing objects of
  	 * the same `toStringTag`.
  	 *
  	 * **Note:** This function only supports comparing values with tags of
  	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
  	 *
  	 * @private
  	 * @param {Object} object The object to compare.
  	 * @param {Object} other The other object to compare.
  	 * @param {string} tag The `toStringTag` of the objects to compare.
  	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
  	 * @param {Function} customizer The function to customize comparisons.
  	 * @param {Function} equalFunc The function to determine equivalents of values.
  	 * @param {Object} stack Tracks traversed `object` and `other` objects.
  	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
  	 */
  	function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  	  switch (tag) {
  	    case dataViewTag:
  	      if ((object.byteLength != other.byteLength) ||
  	          (object.byteOffset != other.byteOffset)) {
  	        return false;
  	      }
  	      object = object.buffer;
  	      other = other.buffer;

  	    case arrayBufferTag:
  	      if ((object.byteLength != other.byteLength) ||
  	          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
  	        return false;
  	      }
  	      return true;

  	    case boolTag:
  	    case dateTag:
  	    case numberTag:
  	      // Coerce booleans to `1` or `0` and dates to milliseconds.
  	      // Invalid dates are coerced to `NaN`.
  	      return eq(+object, +other);

  	    case errorTag:
  	      return object.name == other.name && object.message == other.message;

  	    case regexpTag:
  	    case stringTag:
  	      // Coerce regexes to strings and treat strings, primitives and objects,
  	      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
  	      // for more details.
  	      return object == (other + '');

  	    case mapTag:
  	      var convert = mapToArray;

  	    case setTag:
  	      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
  	      convert || (convert = setToArray);

  	      if (object.size != other.size && !isPartial) {
  	        return false;
  	      }
  	      // Assume cyclic values are equal.
  	      var stacked = stack.get(object);
  	      if (stacked) {
  	        return stacked == other;
  	      }
  	      bitmask |= COMPARE_UNORDERED_FLAG;

  	      // Recursively compare objects (susceptible to call stack limits).
  	      stack.set(object, other);
  	      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
  	      stack['delete'](object);
  	      return result;

  	    case symbolTag:
  	      if (symbolValueOf) {
  	        return symbolValueOf.call(object) == symbolValueOf.call(other);
  	      }
  	  }
  	  return false;
  	}

  	_equalByTag = equalByTag;
  	return _equalByTag;
  }

  var _equalObjects;
  var hasRequired_equalObjects;

  function require_equalObjects () {
  	if (hasRequired_equalObjects) return _equalObjects;
  	hasRequired_equalObjects = 1;
  	var getAllKeys = require_getAllKeys();

  	/** Used to compose bitmasks for value comparisons. */
  	var COMPARE_PARTIAL_FLAG = 1;

  	/** Used for built-in method references. */
  	var objectProto = Object.prototype;

  	/** Used to check objects for own properties. */
  	var hasOwnProperty = objectProto.hasOwnProperty;

  	/**
  	 * A specialized version of `baseIsEqualDeep` for objects with support for
  	 * partial deep comparisons.
  	 *
  	 * @private
  	 * @param {Object} object The object to compare.
  	 * @param {Object} other The other object to compare.
  	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
  	 * @param {Function} customizer The function to customize comparisons.
  	 * @param {Function} equalFunc The function to determine equivalents of values.
  	 * @param {Object} stack Tracks traversed `object` and `other` objects.
  	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
  	 */
  	function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  	  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
  	      objProps = getAllKeys(object),
  	      objLength = objProps.length,
  	      othProps = getAllKeys(other),
  	      othLength = othProps.length;

  	  if (objLength != othLength && !isPartial) {
  	    return false;
  	  }
  	  var index = objLength;
  	  while (index--) {
  	    var key = objProps[index];
  	    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
  	      return false;
  	    }
  	  }
  	  // Check that cyclic values are equal.
  	  var objStacked = stack.get(object);
  	  var othStacked = stack.get(other);
  	  if (objStacked && othStacked) {
  	    return objStacked == other && othStacked == object;
  	  }
  	  var result = true;
  	  stack.set(object, other);
  	  stack.set(other, object);

  	  var skipCtor = isPartial;
  	  while (++index < objLength) {
  	    key = objProps[index];
  	    var objValue = object[key],
  	        othValue = other[key];

  	    if (customizer) {
  	      var compared = isPartial
  	        ? customizer(othValue, objValue, key, other, object, stack)
  	        : customizer(objValue, othValue, key, object, other, stack);
  	    }
  	    // Recursively compare objects (susceptible to call stack limits).
  	    if (!(compared === undefined
  	          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
  	          : compared
  	        )) {
  	      result = false;
  	      break;
  	    }
  	    skipCtor || (skipCtor = key == 'constructor');
  	  }
  	  if (result && !skipCtor) {
  	    var objCtor = object.constructor,
  	        othCtor = other.constructor;

  	    // Non `Object` object instances with different constructors are not equal.
  	    if (objCtor != othCtor &&
  	        ('constructor' in object && 'constructor' in other) &&
  	        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
  	          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
  	      result = false;
  	    }
  	  }
  	  stack['delete'](object);
  	  stack['delete'](other);
  	  return result;
  	}

  	_equalObjects = equalObjects;
  	return _equalObjects;
  }

  var _baseIsEqualDeep;
  var hasRequired_baseIsEqualDeep;

  function require_baseIsEqualDeep () {
  	if (hasRequired_baseIsEqualDeep) return _baseIsEqualDeep;
  	hasRequired_baseIsEqualDeep = 1;
  	var Stack = require_Stack(),
  	    equalArrays = require_equalArrays(),
  	    equalByTag = require_equalByTag(),
  	    equalObjects = require_equalObjects(),
  	    getTag = require_getTag(),
  	    isArray = requireIsArray(),
  	    isBuffer = requireIsBuffer(),
  	    isTypedArray = requireIsTypedArray();

  	/** Used to compose bitmasks for value comparisons. */
  	var COMPARE_PARTIAL_FLAG = 1;

  	/** `Object#toString` result references. */
  	var argsTag = '[object Arguments]',
  	    arrayTag = '[object Array]',
  	    objectTag = '[object Object]';

  	/** Used for built-in method references. */
  	var objectProto = Object.prototype;

  	/** Used to check objects for own properties. */
  	var hasOwnProperty = objectProto.hasOwnProperty;

  	/**
  	 * A specialized version of `baseIsEqual` for arrays and objects which performs
  	 * deep comparisons and tracks traversed objects enabling objects with circular
  	 * references to be compared.
  	 *
  	 * @private
  	 * @param {Object} object The object to compare.
  	 * @param {Object} other The other object to compare.
  	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
  	 * @param {Function} customizer The function to customize comparisons.
  	 * @param {Function} equalFunc The function to determine equivalents of values.
  	 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
  	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
  	 */
  	function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  	  var objIsArr = isArray(object),
  	      othIsArr = isArray(other),
  	      objTag = objIsArr ? arrayTag : getTag(object),
  	      othTag = othIsArr ? arrayTag : getTag(other);

  	  objTag = objTag == argsTag ? objectTag : objTag;
  	  othTag = othTag == argsTag ? objectTag : othTag;

  	  var objIsObj = objTag == objectTag,
  	      othIsObj = othTag == objectTag,
  	      isSameTag = objTag == othTag;

  	  if (isSameTag && isBuffer(object)) {
  	    if (!isBuffer(other)) {
  	      return false;
  	    }
  	    objIsArr = true;
  	    objIsObj = false;
  	  }
  	  if (isSameTag && !objIsObj) {
  	    stack || (stack = new Stack);
  	    return (objIsArr || isTypedArray(object))
  	      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
  	      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  	  }
  	  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
  	    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
  	        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

  	    if (objIsWrapped || othIsWrapped) {
  	      var objUnwrapped = objIsWrapped ? object.value() : object,
  	          othUnwrapped = othIsWrapped ? other.value() : other;

  	      stack || (stack = new Stack);
  	      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
  	    }
  	  }
  	  if (!isSameTag) {
  	    return false;
  	  }
  	  stack || (stack = new Stack);
  	  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
  	}

  	_baseIsEqualDeep = baseIsEqualDeep;
  	return _baseIsEqualDeep;
  }

  var _baseIsEqual;
  var hasRequired_baseIsEqual;

  function require_baseIsEqual () {
  	if (hasRequired_baseIsEqual) return _baseIsEqual;
  	hasRequired_baseIsEqual = 1;
  	var baseIsEqualDeep = require_baseIsEqualDeep(),
  	    isObjectLike = requireIsObjectLike();

  	/**
  	 * The base implementation of `_.isEqual` which supports partial comparisons
  	 * and tracks traversed objects.
  	 *
  	 * @private
  	 * @param {*} value The value to compare.
  	 * @param {*} other The other value to compare.
  	 * @param {boolean} bitmask The bitmask flags.
  	 *  1 - Unordered comparison
  	 *  2 - Partial comparison
  	 * @param {Function} [customizer] The function to customize comparisons.
  	 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
  	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
  	 */
  	function baseIsEqual(value, other, bitmask, customizer, stack) {
  	  if (value === other) {
  	    return true;
  	  }
  	  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
  	    return value !== value && other !== other;
  	  }
  	  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
  	}

  	_baseIsEqual = baseIsEqual;
  	return _baseIsEqual;
  }

  var _baseIsMatch;
  var hasRequired_baseIsMatch;

  function require_baseIsMatch () {
  	if (hasRequired_baseIsMatch) return _baseIsMatch;
  	hasRequired_baseIsMatch = 1;
  	var Stack = require_Stack(),
  	    baseIsEqual = require_baseIsEqual();

  	/** Used to compose bitmasks for value comparisons. */
  	var COMPARE_PARTIAL_FLAG = 1,
  	    COMPARE_UNORDERED_FLAG = 2;

  	/**
  	 * The base implementation of `_.isMatch` without support for iteratee shorthands.
  	 *
  	 * @private
  	 * @param {Object} object The object to inspect.
  	 * @param {Object} source The object of property values to match.
  	 * @param {Array} matchData The property names, values, and compare flags to match.
  	 * @param {Function} [customizer] The function to customize comparisons.
  	 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
  	 */
  	function baseIsMatch(object, source, matchData, customizer) {
  	  var index = matchData.length,
  	      length = index,
  	      noCustomizer = !customizer;

  	  if (object == null) {
  	    return !length;
  	  }
  	  object = Object(object);
  	  while (index--) {
  	    var data = matchData[index];
  	    if ((noCustomizer && data[2])
  	          ? data[1] !== object[data[0]]
  	          : !(data[0] in object)
  	        ) {
  	      return false;
  	    }
  	  }
  	  while (++index < length) {
  	    data = matchData[index];
  	    var key = data[0],
  	        objValue = object[key],
  	        srcValue = data[1];

  	    if (noCustomizer && data[2]) {
  	      if (objValue === undefined && !(key in object)) {
  	        return false;
  	      }
  	    } else {
  	      var stack = new Stack;
  	      if (customizer) {
  	        var result = customizer(objValue, srcValue, key, object, source, stack);
  	      }
  	      if (!(result === undefined
  	            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
  	            : result
  	          )) {
  	        return false;
  	      }
  	    }
  	  }
  	  return true;
  	}

  	_baseIsMatch = baseIsMatch;
  	return _baseIsMatch;
  }

  var _isStrictComparable;
  var hasRequired_isStrictComparable;

  function require_isStrictComparable () {
  	if (hasRequired_isStrictComparable) return _isStrictComparable;
  	hasRequired_isStrictComparable = 1;
  	var isObject = requireIsObject();

  	/**
  	 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
  	 *
  	 * @private
  	 * @param {*} value The value to check.
  	 * @returns {boolean} Returns `true` if `value` if suitable for strict
  	 *  equality comparisons, else `false`.
  	 */
  	function isStrictComparable(value) {
  	  return value === value && !isObject(value);
  	}

  	_isStrictComparable = isStrictComparable;
  	return _isStrictComparable;
  }

  var _getMatchData;
  var hasRequired_getMatchData;

  function require_getMatchData () {
  	if (hasRequired_getMatchData) return _getMatchData;
  	hasRequired_getMatchData = 1;
  	var isStrictComparable = require_isStrictComparable(),
  	    keys = requireKeys();

  	/**
  	 * Gets the property names, values, and compare flags of `object`.
  	 *
  	 * @private
  	 * @param {Object} object The object to query.
  	 * @returns {Array} Returns the match data of `object`.
  	 */
  	function getMatchData(object) {
  	  var result = keys(object),
  	      length = result.length;

  	  while (length--) {
  	    var key = result[length],
  	        value = object[key];

  	    result[length] = [key, value, isStrictComparable(value)];
  	  }
  	  return result;
  	}

  	_getMatchData = getMatchData;
  	return _getMatchData;
  }

  /**
   * A specialized version of `matchesProperty` for source values suitable
   * for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @param {*} srcValue The value to match.
   * @returns {Function} Returns the new spec function.
   */

  var _matchesStrictComparable;
  var hasRequired_matchesStrictComparable;

  function require_matchesStrictComparable () {
  	if (hasRequired_matchesStrictComparable) return _matchesStrictComparable;
  	hasRequired_matchesStrictComparable = 1;
  	function matchesStrictComparable(key, srcValue) {
  	  return function(object) {
  	    if (object == null) {
  	      return false;
  	    }
  	    return object[key] === srcValue &&
  	      (srcValue !== undefined || (key in Object(object)));
  	  };
  	}

  	_matchesStrictComparable = matchesStrictComparable;
  	return _matchesStrictComparable;
  }

  var _baseMatches;
  var hasRequired_baseMatches;

  function require_baseMatches () {
  	if (hasRequired_baseMatches) return _baseMatches;
  	hasRequired_baseMatches = 1;
  	var baseIsMatch = require_baseIsMatch(),
  	    getMatchData = require_getMatchData(),
  	    matchesStrictComparable = require_matchesStrictComparable();

  	/**
  	 * The base implementation of `_.matches` which doesn't clone `source`.
  	 *
  	 * @private
  	 * @param {Object} source The object of property values to match.
  	 * @returns {Function} Returns the new spec function.
  	 */
  	function baseMatches(source) {
  	  var matchData = getMatchData(source);
  	  if (matchData.length == 1 && matchData[0][2]) {
  	    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  	  }
  	  return function(object) {
  	    return object === source || baseIsMatch(object, source, matchData);
  	  };
  	}

  	_baseMatches = baseMatches;
  	return _baseMatches;
  }

  var isSymbol_1;
  var hasRequiredIsSymbol;

  function requireIsSymbol () {
  	if (hasRequiredIsSymbol) return isSymbol_1;
  	hasRequiredIsSymbol = 1;
  	var baseGetTag = require_baseGetTag(),
  	    isObjectLike = requireIsObjectLike();

  	/** `Object#toString` result references. */
  	var symbolTag = '[object Symbol]';

  	/**
  	 * Checks if `value` is classified as a `Symbol` primitive or object.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 4.0.0
  	 * @category Lang
  	 * @param {*} value The value to check.
  	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
  	 * @example
  	 *
  	 * _.isSymbol(Symbol.iterator);
  	 * // => true
  	 *
  	 * _.isSymbol('abc');
  	 * // => false
  	 */
  	function isSymbol(value) {
  	  return typeof value == 'symbol' ||
  	    (isObjectLike(value) && baseGetTag(value) == symbolTag);
  	}

  	isSymbol_1 = isSymbol;
  	return isSymbol_1;
  }

  var _isKey;
  var hasRequired_isKey;

  function require_isKey () {
  	if (hasRequired_isKey) return _isKey;
  	hasRequired_isKey = 1;
  	var isArray = requireIsArray(),
  	    isSymbol = requireIsSymbol();

  	/** Used to match property names within property paths. */
  	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
  	    reIsPlainProp = /^\w*$/;

  	/**
  	 * Checks if `value` is a property name and not a property path.
  	 *
  	 * @private
  	 * @param {*} value The value to check.
  	 * @param {Object} [object] The object to query keys on.
  	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
  	 */
  	function isKey(value, object) {
  	  if (isArray(value)) {
  	    return false;
  	  }
  	  var type = typeof value;
  	  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
  	      value == null || isSymbol(value)) {
  	    return true;
  	  }
  	  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
  	    (object != null && value in Object(object));
  	}

  	_isKey = isKey;
  	return _isKey;
  }

  var memoize_1;
  var hasRequiredMemoize;

  function requireMemoize () {
  	if (hasRequiredMemoize) return memoize_1;
  	hasRequiredMemoize = 1;
  	var MapCache = require_MapCache();

  	/** Error message constants. */
  	var FUNC_ERROR_TEXT = 'Expected a function';

  	/**
  	 * Creates a function that memoizes the result of `func`. If `resolver` is
  	 * provided, it determines the cache key for storing the result based on the
  	 * arguments provided to the memoized function. By default, the first argument
  	 * provided to the memoized function is used as the map cache key. The `func`
  	 * is invoked with the `this` binding of the memoized function.
  	 *
  	 * **Note:** The cache is exposed as the `cache` property on the memoized
  	 * function. Its creation may be customized by replacing the `_.memoize.Cache`
  	 * constructor with one whose instances implement the
  	 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
  	 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 0.1.0
  	 * @category Function
  	 * @param {Function} func The function to have its output memoized.
  	 * @param {Function} [resolver] The function to resolve the cache key.
  	 * @returns {Function} Returns the new memoized function.
  	 * @example
  	 *
  	 * var object = { 'a': 1, 'b': 2 };
  	 * var other = { 'c': 3, 'd': 4 };
  	 *
  	 * var values = _.memoize(_.values);
  	 * values(object);
  	 * // => [1, 2]
  	 *
  	 * values(other);
  	 * // => [3, 4]
  	 *
  	 * object.a = 2;
  	 * values(object);
  	 * // => [1, 2]
  	 *
  	 * // Modify the result cache.
  	 * values.cache.set(object, ['a', 'b']);
  	 * values(object);
  	 * // => ['a', 'b']
  	 *
  	 * // Replace `_.memoize.Cache`.
  	 * _.memoize.Cache = WeakMap;
  	 */
  	function memoize(func, resolver) {
  	  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
  	    throw new TypeError(FUNC_ERROR_TEXT);
  	  }
  	  var memoized = function() {
  	    var args = arguments,
  	        key = resolver ? resolver.apply(this, args) : args[0],
  	        cache = memoized.cache;

  	    if (cache.has(key)) {
  	      return cache.get(key);
  	    }
  	    var result = func.apply(this, args);
  	    memoized.cache = cache.set(key, result) || cache;
  	    return result;
  	  };
  	  memoized.cache = new (memoize.Cache || MapCache);
  	  return memoized;
  	}

  	// Expose `MapCache`.
  	memoize.Cache = MapCache;

  	memoize_1 = memoize;
  	return memoize_1;
  }

  var _memoizeCapped;
  var hasRequired_memoizeCapped;

  function require_memoizeCapped () {
  	if (hasRequired_memoizeCapped) return _memoizeCapped;
  	hasRequired_memoizeCapped = 1;
  	var memoize = requireMemoize();

  	/** Used as the maximum memoize cache size. */
  	var MAX_MEMOIZE_SIZE = 500;

  	/**
  	 * A specialized version of `_.memoize` which clears the memoized function's
  	 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
  	 *
  	 * @private
  	 * @param {Function} func The function to have its output memoized.
  	 * @returns {Function} Returns the new memoized function.
  	 */
  	function memoizeCapped(func) {
  	  var result = memoize(func, function(key) {
  	    if (cache.size === MAX_MEMOIZE_SIZE) {
  	      cache.clear();
  	    }
  	    return key;
  	  });

  	  var cache = result.cache;
  	  return result;
  	}

  	_memoizeCapped = memoizeCapped;
  	return _memoizeCapped;
  }

  var _stringToPath;
  var hasRequired_stringToPath;

  function require_stringToPath () {
  	if (hasRequired_stringToPath) return _stringToPath;
  	hasRequired_stringToPath = 1;
  	var memoizeCapped = require_memoizeCapped();

  	/** Used to match property names within property paths. */
  	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

  	/** Used to match backslashes in property paths. */
  	var reEscapeChar = /\\(\\)?/g;

  	/**
  	 * Converts `string` to a property path array.
  	 *
  	 * @private
  	 * @param {string} string The string to convert.
  	 * @returns {Array} Returns the property path array.
  	 */
  	var stringToPath = memoizeCapped(function(string) {
  	  var result = [];
  	  if (string.charCodeAt(0) === 46 /* . */) {
  	    result.push('');
  	  }
  	  string.replace(rePropName, function(match, number, quote, subString) {
  	    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  	  });
  	  return result;
  	});

  	_stringToPath = stringToPath;
  	return _stringToPath;
  }

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */

  var _arrayMap;
  var hasRequired_arrayMap;

  function require_arrayMap () {
  	if (hasRequired_arrayMap) return _arrayMap;
  	hasRequired_arrayMap = 1;
  	function arrayMap(array, iteratee) {
  	  var index = -1,
  	      length = array == null ? 0 : array.length,
  	      result = Array(length);

  	  while (++index < length) {
  	    result[index] = iteratee(array[index], index, array);
  	  }
  	  return result;
  	}

  	_arrayMap = arrayMap;
  	return _arrayMap;
  }

  var _baseToString;
  var hasRequired_baseToString;

  function require_baseToString () {
  	if (hasRequired_baseToString) return _baseToString;
  	hasRequired_baseToString = 1;
  	var Symbol = require_Symbol(),
  	    arrayMap = require_arrayMap(),
  	    isArray = requireIsArray(),
  	    isSymbol = requireIsSymbol();

  	/** Used to convert symbols to primitives and strings. */
  	var symbolProto = Symbol ? Symbol.prototype : undefined,
  	    symbolToString = symbolProto ? symbolProto.toString : undefined;

  	/**
  	 * The base implementation of `_.toString` which doesn't convert nullish
  	 * values to empty strings.
  	 *
  	 * @private
  	 * @param {*} value The value to process.
  	 * @returns {string} Returns the string.
  	 */
  	function baseToString(value) {
  	  // Exit early for strings to avoid a performance hit in some environments.
  	  if (typeof value == 'string') {
  	    return value;
  	  }
  	  if (isArray(value)) {
  	    // Recursively convert values (susceptible to call stack limits).
  	    return arrayMap(value, baseToString) + '';
  	  }
  	  if (isSymbol(value)) {
  	    return symbolToString ? symbolToString.call(value) : '';
  	  }
  	  var result = (value + '');
  	  return (result == '0' && (1 / value) == -Infinity) ? '-0' : result;
  	}

  	_baseToString = baseToString;
  	return _baseToString;
  }

  var toString_1;
  var hasRequiredToString;

  function requireToString () {
  	if (hasRequiredToString) return toString_1;
  	hasRequiredToString = 1;
  	var baseToString = require_baseToString();

  	/**
  	 * Converts `value` to a string. An empty string is returned for `null`
  	 * and `undefined` values. The sign of `-0` is preserved.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 4.0.0
  	 * @category Lang
  	 * @param {*} value The value to convert.
  	 * @returns {string} Returns the converted string.
  	 * @example
  	 *
  	 * _.toString(null);
  	 * // => ''
  	 *
  	 * _.toString(-0);
  	 * // => '-0'
  	 *
  	 * _.toString([1, 2, 3]);
  	 * // => '1,2,3'
  	 */
  	function toString(value) {
  	  return value == null ? '' : baseToString(value);
  	}

  	toString_1 = toString;
  	return toString_1;
  }

  var _castPath;
  var hasRequired_castPath;

  function require_castPath () {
  	if (hasRequired_castPath) return _castPath;
  	hasRequired_castPath = 1;
  	var isArray = requireIsArray(),
  	    isKey = require_isKey(),
  	    stringToPath = require_stringToPath(),
  	    toString = requireToString();

  	/**
  	 * Casts `value` to a path array if it's not one.
  	 *
  	 * @private
  	 * @param {*} value The value to inspect.
  	 * @param {Object} [object] The object to query keys on.
  	 * @returns {Array} Returns the cast property path array.
  	 */
  	function castPath(value, object) {
  	  if (isArray(value)) {
  	    return value;
  	  }
  	  return isKey(value, object) ? [value] : stringToPath(toString(value));
  	}

  	_castPath = castPath;
  	return _castPath;
  }

  var _toKey;
  var hasRequired_toKey;

  function require_toKey () {
  	if (hasRequired_toKey) return _toKey;
  	hasRequired_toKey = 1;
  	var isSymbol = requireIsSymbol();

  	/**
  	 * Converts `value` to a string key if it's not a string or symbol.
  	 *
  	 * @private
  	 * @param {*} value The value to inspect.
  	 * @returns {string|symbol} Returns the key.
  	 */
  	function toKey(value) {
  	  if (typeof value == 'string' || isSymbol(value)) {
  	    return value;
  	  }
  	  var result = (value + '');
  	  return (result == '0' && (1 / value) == -Infinity) ? '-0' : result;
  	}

  	_toKey = toKey;
  	return _toKey;
  }

  var _baseGet;
  var hasRequired_baseGet;

  function require_baseGet () {
  	if (hasRequired_baseGet) return _baseGet;
  	hasRequired_baseGet = 1;
  	var castPath = require_castPath(),
  	    toKey = require_toKey();

  	/**
  	 * The base implementation of `_.get` without support for default values.
  	 *
  	 * @private
  	 * @param {Object} object The object to query.
  	 * @param {Array|string} path The path of the property to get.
  	 * @returns {*} Returns the resolved value.
  	 */
  	function baseGet(object, path) {
  	  path = castPath(path, object);

  	  var index = 0,
  	      length = path.length;

  	  while (object != null && index < length) {
  	    object = object[toKey(path[index++])];
  	  }
  	  return (index && index == length) ? object : undefined;
  	}

  	_baseGet = baseGet;
  	return _baseGet;
  }

  var get_1;
  var hasRequiredGet;

  function requireGet () {
  	if (hasRequiredGet) return get_1;
  	hasRequiredGet = 1;
  	var baseGet = require_baseGet();

  	/**
  	 * Gets the value at `path` of `object`. If the resolved value is
  	 * `undefined`, the `defaultValue` is returned in its place.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 3.7.0
  	 * @category Object
  	 * @param {Object} object The object to query.
  	 * @param {Array|string} path The path of the property to get.
  	 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
  	 * @returns {*} Returns the resolved value.
  	 * @example
  	 *
  	 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
  	 *
  	 * _.get(object, 'a[0].b.c');
  	 * // => 3
  	 *
  	 * _.get(object, ['a', '0', 'b', 'c']);
  	 * // => 3
  	 *
  	 * _.get(object, 'a.b.c', 'default');
  	 * // => 'default'
  	 */
  	function get(object, path, defaultValue) {
  	  var result = object == null ? undefined : baseGet(object, path);
  	  return result === undefined ? defaultValue : result;
  	}

  	get_1 = get;
  	return get_1;
  }

  /**
   * The base implementation of `_.hasIn` without support for deep paths.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {Array|string} key The key to check.
   * @returns {boolean} Returns `true` if `key` exists, else `false`.
   */

  var _baseHasIn;
  var hasRequired_baseHasIn;

  function require_baseHasIn () {
  	if (hasRequired_baseHasIn) return _baseHasIn;
  	hasRequired_baseHasIn = 1;
  	function baseHasIn(object, key) {
  	  return object != null && key in Object(object);
  	}

  	_baseHasIn = baseHasIn;
  	return _baseHasIn;
  }

  var _hasPath;
  var hasRequired_hasPath;

  function require_hasPath () {
  	if (hasRequired_hasPath) return _hasPath;
  	hasRequired_hasPath = 1;
  	var castPath = require_castPath(),
  	    isArguments = requireIsArguments(),
  	    isArray = requireIsArray(),
  	    isIndex = require_isIndex(),
  	    isLength = requireIsLength(),
  	    toKey = require_toKey();

  	/**
  	 * Checks if `path` exists on `object`.
  	 *
  	 * @private
  	 * @param {Object} object The object to query.
  	 * @param {Array|string} path The path to check.
  	 * @param {Function} hasFunc The function to check properties.
  	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
  	 */
  	function hasPath(object, path, hasFunc) {
  	  path = castPath(path, object);

  	  var index = -1,
  	      length = path.length,
  	      result = false;

  	  while (++index < length) {
  	    var key = toKey(path[index]);
  	    if (!(result = object != null && hasFunc(object, key))) {
  	      break;
  	    }
  	    object = object[key];
  	  }
  	  if (result || ++index != length) {
  	    return result;
  	  }
  	  length = object == null ? 0 : object.length;
  	  return !!length && isLength(length) && isIndex(key, length) &&
  	    (isArray(object) || isArguments(object));
  	}

  	_hasPath = hasPath;
  	return _hasPath;
  }

  var hasIn_1;
  var hasRequiredHasIn;

  function requireHasIn () {
  	if (hasRequiredHasIn) return hasIn_1;
  	hasRequiredHasIn = 1;
  	var baseHasIn = require_baseHasIn(),
  	    hasPath = require_hasPath();

  	/**
  	 * Checks if `path` is a direct or inherited property of `object`.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 4.0.0
  	 * @category Object
  	 * @param {Object} object The object to query.
  	 * @param {Array|string} path The path to check.
  	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
  	 * @example
  	 *
  	 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
  	 *
  	 * _.hasIn(object, 'a');
  	 * // => true
  	 *
  	 * _.hasIn(object, 'a.b');
  	 * // => true
  	 *
  	 * _.hasIn(object, ['a', 'b']);
  	 * // => true
  	 *
  	 * _.hasIn(object, 'b');
  	 * // => false
  	 */
  	function hasIn(object, path) {
  	  return object != null && hasPath(object, path, baseHasIn);
  	}

  	hasIn_1 = hasIn;
  	return hasIn_1;
  }

  var _baseMatchesProperty;
  var hasRequired_baseMatchesProperty;

  function require_baseMatchesProperty () {
  	if (hasRequired_baseMatchesProperty) return _baseMatchesProperty;
  	hasRequired_baseMatchesProperty = 1;
  	var baseIsEqual = require_baseIsEqual(),
  	    get = requireGet(),
  	    hasIn = requireHasIn(),
  	    isKey = require_isKey(),
  	    isStrictComparable = require_isStrictComparable(),
  	    matchesStrictComparable = require_matchesStrictComparable(),
  	    toKey = require_toKey();

  	/** Used to compose bitmasks for value comparisons. */
  	var COMPARE_PARTIAL_FLAG = 1,
  	    COMPARE_UNORDERED_FLAG = 2;

  	/**
  	 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
  	 *
  	 * @private
  	 * @param {string} path The path of the property to get.
  	 * @param {*} srcValue The value to match.
  	 * @returns {Function} Returns the new spec function.
  	 */
  	function baseMatchesProperty(path, srcValue) {
  	  if (isKey(path) && isStrictComparable(srcValue)) {
  	    return matchesStrictComparable(toKey(path), srcValue);
  	  }
  	  return function(object) {
  	    var objValue = get(object, path);
  	    return (objValue === undefined && objValue === srcValue)
  	      ? hasIn(object, path)
  	      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  	  };
  	}

  	_baseMatchesProperty = baseMatchesProperty;
  	return _baseMatchesProperty;
  }

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new accessor function.
   */

  var _baseProperty;
  var hasRequired_baseProperty;

  function require_baseProperty () {
  	if (hasRequired_baseProperty) return _baseProperty;
  	hasRequired_baseProperty = 1;
  	function baseProperty(key) {
  	  return function(object) {
  	    return object == null ? undefined : object[key];
  	  };
  	}

  	_baseProperty = baseProperty;
  	return _baseProperty;
  }

  var _basePropertyDeep;
  var hasRequired_basePropertyDeep;

  function require_basePropertyDeep () {
  	if (hasRequired_basePropertyDeep) return _basePropertyDeep;
  	hasRequired_basePropertyDeep = 1;
  	var baseGet = require_baseGet();

  	/**
  	 * A specialized version of `baseProperty` which supports deep paths.
  	 *
  	 * @private
  	 * @param {Array|string} path The path of the property to get.
  	 * @returns {Function} Returns the new accessor function.
  	 */
  	function basePropertyDeep(path) {
  	  return function(object) {
  	    return baseGet(object, path);
  	  };
  	}

  	_basePropertyDeep = basePropertyDeep;
  	return _basePropertyDeep;
  }

  var property_1;
  var hasRequiredProperty;

  function requireProperty () {
  	if (hasRequiredProperty) return property_1;
  	hasRequiredProperty = 1;
  	var baseProperty = require_baseProperty(),
  	    basePropertyDeep = require_basePropertyDeep(),
  	    isKey = require_isKey(),
  	    toKey = require_toKey();

  	/**
  	 * Creates a function that returns the value at `path` of a given object.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 2.4.0
  	 * @category Util
  	 * @param {Array|string} path The path of the property to get.
  	 * @returns {Function} Returns the new accessor function.
  	 * @example
  	 *
  	 * var objects = [
  	 *   { 'a': { 'b': 2 } },
  	 *   { 'a': { 'b': 1 } }
  	 * ];
  	 *
  	 * _.map(objects, _.property('a.b'));
  	 * // => [2, 1]
  	 *
  	 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
  	 * // => [1, 2]
  	 */
  	function property(path) {
  	  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
  	}

  	property_1 = property;
  	return property_1;
  }

  var _baseIteratee;
  var hasRequired_baseIteratee;

  function require_baseIteratee () {
  	if (hasRequired_baseIteratee) return _baseIteratee;
  	hasRequired_baseIteratee = 1;
  	var baseMatches = require_baseMatches(),
  	    baseMatchesProperty = require_baseMatchesProperty(),
  	    identity = requireIdentity(),
  	    isArray = requireIsArray(),
  	    property = requireProperty();

  	/**
  	 * The base implementation of `_.iteratee`.
  	 *
  	 * @private
  	 * @param {*} [value=_.identity] The value to convert to an iteratee.
  	 * @returns {Function} Returns the iteratee.
  	 */
  	function baseIteratee(value) {
  	  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  	  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  	  if (typeof value == 'function') {
  	    return value;
  	  }
  	  if (value == null) {
  	    return identity;
  	  }
  	  if (typeof value == 'object') {
  	    return isArray(value)
  	      ? baseMatchesProperty(value[0], value[1])
  	      : baseMatches(value);
  	  }
  	  return property(value);
  	}

  	_baseIteratee = baseIteratee;
  	return _baseIteratee;
  }

  var filter_1;
  var hasRequiredFilter;

  function requireFilter () {
  	if (hasRequiredFilter) return filter_1;
  	hasRequiredFilter = 1;
  	var arrayFilter = require_arrayFilter(),
  	    baseFilter = require_baseFilter(),
  	    baseIteratee = require_baseIteratee(),
  	    isArray = requireIsArray();

  	/**
  	 * Iterates over elements of `collection`, returning an array of all elements
  	 * `predicate` returns truthy for. The predicate is invoked with three
  	 * arguments: (value, index|key, collection).
  	 *
  	 * **Note:** Unlike `_.remove`, this method returns a new array.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 0.1.0
  	 * @category Collection
  	 * @param {Array|Object} collection The collection to iterate over.
  	 * @param {Function} [predicate=_.identity] The function invoked per iteration.
  	 * @returns {Array} Returns the new filtered array.
  	 * @see _.reject
  	 * @example
  	 *
  	 * var users = [
  	 *   { 'user': 'barney', 'age': 36, 'active': true },
  	 *   { 'user': 'fred',   'age': 40, 'active': false }
  	 * ];
  	 *
  	 * _.filter(users, function(o) { return !o.active; });
  	 * // => objects for ['fred']
  	 *
  	 * // The `_.matches` iteratee shorthand.
  	 * _.filter(users, { 'age': 36, 'active': true });
  	 * // => objects for ['barney']
  	 *
  	 * // The `_.matchesProperty` iteratee shorthand.
  	 * _.filter(users, ['active', false]);
  	 * // => objects for ['fred']
  	 *
  	 * // The `_.property` iteratee shorthand.
  	 * _.filter(users, 'active');
  	 * // => objects for ['barney']
  	 *
  	 * // Combining several predicates using `_.overEvery` or `_.overSome`.
  	 * _.filter(users, _.overSome([{ 'age': 36 }, ['age', 40]]));
  	 * // => objects for ['fred', 'barney']
  	 */
  	function filter(collection, predicate) {
  	  var func = isArray(collection) ? arrayFilter : baseFilter;
  	  return func(collection, baseIteratee(predicate, 3));
  	}

  	filter_1 = filter;
  	return filter_1;
  }

  /** Used for built-in method references. */

  var _baseHas;
  var hasRequired_baseHas;

  function require_baseHas () {
  	if (hasRequired_baseHas) return _baseHas;
  	hasRequired_baseHas = 1;
  	var objectProto = Object.prototype;

  	/** Used to check objects for own properties. */
  	var hasOwnProperty = objectProto.hasOwnProperty;

  	/**
  	 * The base implementation of `_.has` without support for deep paths.
  	 *
  	 * @private
  	 * @param {Object} [object] The object to query.
  	 * @param {Array|string} key The key to check.
  	 * @returns {boolean} Returns `true` if `key` exists, else `false`.
  	 */
  	function baseHas(object, key) {
  	  return object != null && hasOwnProperty.call(object, key);
  	}

  	_baseHas = baseHas;
  	return _baseHas;
  }

  var has_1;
  var hasRequiredHas;

  function requireHas () {
  	if (hasRequiredHas) return has_1;
  	hasRequiredHas = 1;
  	var baseHas = require_baseHas(),
  	    hasPath = require_hasPath();

  	/**
  	 * Checks if `path` is a direct property of `object`.
  	 *
  	 * @static
  	 * @since 0.1.0
  	 * @memberOf _
  	 * @category Object
  	 * @param {Object} object The object to query.
  	 * @param {Array|string} path The path to check.
  	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
  	 * @example
  	 *
  	 * var object = { 'a': { 'b': 2 } };
  	 * var other = _.create({ 'a': _.create({ 'b': 2 }) });
  	 *
  	 * _.has(object, 'a');
  	 * // => true
  	 *
  	 * _.has(object, 'a.b');
  	 * // => true
  	 *
  	 * _.has(object, ['a', 'b']);
  	 * // => true
  	 *
  	 * _.has(other, 'a');
  	 * // => false
  	 */
  	function has(object, path) {
  	  return object != null && hasPath(object, path, baseHas);
  	}

  	has_1 = has;
  	return has_1;
  }

  var isEmpty_1;
  var hasRequiredIsEmpty;

  function requireIsEmpty () {
  	if (hasRequiredIsEmpty) return isEmpty_1;
  	hasRequiredIsEmpty = 1;
  	var baseKeys = require_baseKeys(),
  	    getTag = require_getTag(),
  	    isArguments = requireIsArguments(),
  	    isArray = requireIsArray(),
  	    isArrayLike = requireIsArrayLike(),
  	    isBuffer = requireIsBuffer(),
  	    isPrototype = require_isPrototype(),
  	    isTypedArray = requireIsTypedArray();

  	/** `Object#toString` result references. */
  	var mapTag = '[object Map]',
  	    setTag = '[object Set]';

  	/** Used for built-in method references. */
  	var objectProto = Object.prototype;

  	/** Used to check objects for own properties. */
  	var hasOwnProperty = objectProto.hasOwnProperty;

  	/**
  	 * Checks if `value` is an empty object, collection, map, or set.
  	 *
  	 * Objects are considered empty if they have no own enumerable string keyed
  	 * properties.
  	 *
  	 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
  	 * jQuery-like collections are considered empty if they have a `length` of `0`.
  	 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 0.1.0
  	 * @category Lang
  	 * @param {*} value The value to check.
  	 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
  	 * @example
  	 *
  	 * _.isEmpty(null);
  	 * // => true
  	 *
  	 * _.isEmpty(true);
  	 * // => true
  	 *
  	 * _.isEmpty(1);
  	 * // => true
  	 *
  	 * _.isEmpty([1, 2, 3]);
  	 * // => false
  	 *
  	 * _.isEmpty({ 'a': 1 });
  	 * // => false
  	 */
  	function isEmpty(value) {
  	  if (value == null) {
  	    return true;
  	  }
  	  if (isArrayLike(value) &&
  	      (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
  	        isBuffer(value) || isTypedArray(value) || isArguments(value))) {
  	    return !value.length;
  	  }
  	  var tag = getTag(value);
  	  if (tag == mapTag || tag == setTag) {
  	    return !value.size;
  	  }
  	  if (isPrototype(value)) {
  	    return !baseKeys(value).length;
  	  }
  	  for (var key in value) {
  	    if (hasOwnProperty.call(value, key)) {
  	      return false;
  	    }
  	  }
  	  return true;
  	}

  	isEmpty_1 = isEmpty;
  	return isEmpty_1;
  }

  /**
   * Checks if `value` is `undefined`.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
   * @example
   *
   * _.isUndefined(void 0);
   * // => true
   *
   * _.isUndefined(null);
   * // => false
   */

  var isUndefined_1;
  var hasRequiredIsUndefined;

  function requireIsUndefined () {
  	if (hasRequiredIsUndefined) return isUndefined_1;
  	hasRequiredIsUndefined = 1;
  	function isUndefined(value) {
  	  return value === undefined;
  	}

  	isUndefined_1 = isUndefined;
  	return isUndefined_1;
  }

  var _baseMap;
  var hasRequired_baseMap;

  function require_baseMap () {
  	if (hasRequired_baseMap) return _baseMap;
  	hasRequired_baseMap = 1;
  	var baseEach = require_baseEach(),
  	    isArrayLike = requireIsArrayLike();

  	/**
  	 * The base implementation of `_.map` without support for iteratee shorthands.
  	 *
  	 * @private
  	 * @param {Array|Object} collection The collection to iterate over.
  	 * @param {Function} iteratee The function invoked per iteration.
  	 * @returns {Array} Returns the new mapped array.
  	 */
  	function baseMap(collection, iteratee) {
  	  var index = -1,
  	      result = isArrayLike(collection) ? Array(collection.length) : [];

  	  baseEach(collection, function(value, key, collection) {
  	    result[++index] = iteratee(value, key, collection);
  	  });
  	  return result;
  	}

  	_baseMap = baseMap;
  	return _baseMap;
  }

  var map_1;
  var hasRequiredMap;

  function requireMap () {
  	if (hasRequiredMap) return map_1;
  	hasRequiredMap = 1;
  	var arrayMap = require_arrayMap(),
  	    baseIteratee = require_baseIteratee(),
  	    baseMap = require_baseMap(),
  	    isArray = requireIsArray();

  	/**
  	 * Creates an array of values by running each element in `collection` thru
  	 * `iteratee`. The iteratee is invoked with three arguments:
  	 * (value, index|key, collection).
  	 *
  	 * Many lodash methods are guarded to work as iteratees for methods like
  	 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
  	 *
  	 * The guarded methods are:
  	 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
  	 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
  	 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
  	 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 0.1.0
  	 * @category Collection
  	 * @param {Array|Object} collection The collection to iterate over.
  	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
  	 * @returns {Array} Returns the new mapped array.
  	 * @example
  	 *
  	 * function square(n) {
  	 *   return n * n;
  	 * }
  	 *
  	 * _.map([4, 8], square);
  	 * // => [16, 64]
  	 *
  	 * _.map({ 'a': 4, 'b': 8 }, square);
  	 * // => [16, 64] (iteration order is not guaranteed)
  	 *
  	 * var users = [
  	 *   { 'user': 'barney' },
  	 *   { 'user': 'fred' }
  	 * ];
  	 *
  	 * // The `_.property` iteratee shorthand.
  	 * _.map(users, 'user');
  	 * // => ['barney', 'fred']
  	 */
  	function map(collection, iteratee) {
  	  var func = isArray(collection) ? arrayMap : baseMap;
  	  return func(collection, baseIteratee(iteratee, 3));
  	}

  	map_1 = map;
  	return map_1;
  }

  /**
   * A specialized version of `_.reduce` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the first element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */

  var _arrayReduce;
  var hasRequired_arrayReduce;

  function require_arrayReduce () {
  	if (hasRequired_arrayReduce) return _arrayReduce;
  	hasRequired_arrayReduce = 1;
  	function arrayReduce(array, iteratee, accumulator, initAccum) {
  	  var index = -1,
  	      length = array == null ? 0 : array.length;

  	  if (initAccum && length) {
  	    accumulator = array[++index];
  	  }
  	  while (++index < length) {
  	    accumulator = iteratee(accumulator, array[index], index, array);
  	  }
  	  return accumulator;
  	}

  	_arrayReduce = arrayReduce;
  	return _arrayReduce;
  }

  /**
   * The base implementation of `_.reduce` and `_.reduceRight`, without support
   * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} accumulator The initial value.
   * @param {boolean} initAccum Specify using the first or last element of
   *  `collection` as the initial value.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the accumulated value.
   */

  var _baseReduce;
  var hasRequired_baseReduce;

  function require_baseReduce () {
  	if (hasRequired_baseReduce) return _baseReduce;
  	hasRequired_baseReduce = 1;
  	function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
  	  eachFunc(collection, function(value, index, collection) {
  	    accumulator = initAccum
  	      ? (initAccum = false, value)
  	      : iteratee(accumulator, value, index, collection);
  	  });
  	  return accumulator;
  	}

  	_baseReduce = baseReduce;
  	return _baseReduce;
  }

  var reduce_1;
  var hasRequiredReduce;

  function requireReduce () {
  	if (hasRequiredReduce) return reduce_1;
  	hasRequiredReduce = 1;
  	var arrayReduce = require_arrayReduce(),
  	    baseEach = require_baseEach(),
  	    baseIteratee = require_baseIteratee(),
  	    baseReduce = require_baseReduce(),
  	    isArray = requireIsArray();

  	/**
  	 * Reduces `collection` to a value which is the accumulated result of running
  	 * each element in `collection` thru `iteratee`, where each successive
  	 * invocation is supplied the return value of the previous. If `accumulator`
  	 * is not given, the first element of `collection` is used as the initial
  	 * value. The iteratee is invoked with four arguments:
  	 * (accumulator, value, index|key, collection).
  	 *
  	 * Many lodash methods are guarded to work as iteratees for methods like
  	 * `_.reduce`, `_.reduceRight`, and `_.transform`.
  	 *
  	 * The guarded methods are:
  	 * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
  	 * and `sortBy`
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 0.1.0
  	 * @category Collection
  	 * @param {Array|Object} collection The collection to iterate over.
  	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
  	 * @param {*} [accumulator] The initial value.
  	 * @returns {*} Returns the accumulated value.
  	 * @see _.reduceRight
  	 * @example
  	 *
  	 * _.reduce([1, 2], function(sum, n) {
  	 *   return sum + n;
  	 * }, 0);
  	 * // => 3
  	 *
  	 * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
  	 *   (result[value] || (result[value] = [])).push(key);
  	 *   return result;
  	 * }, {});
  	 * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
  	 */
  	function reduce(collection, iteratee, accumulator) {
  	  var func = isArray(collection) ? arrayReduce : baseReduce,
  	      initAccum = arguments.length < 3;

  	  return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
  	}

  	reduce_1 = reduce;
  	return reduce_1;
  }

  var isString_1;
  var hasRequiredIsString;

  function requireIsString () {
  	if (hasRequiredIsString) return isString_1;
  	hasRequiredIsString = 1;
  	var baseGetTag = require_baseGetTag(),
  	    isArray = requireIsArray(),
  	    isObjectLike = requireIsObjectLike();

  	/** `Object#toString` result references. */
  	var stringTag = '[object String]';

  	/**
  	 * Checks if `value` is classified as a `String` primitive or object.
  	 *
  	 * @static
  	 * @since 0.1.0
  	 * @memberOf _
  	 * @category Lang
  	 * @param {*} value The value to check.
  	 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
  	 * @example
  	 *
  	 * _.isString('abc');
  	 * // => true
  	 *
  	 * _.isString(1);
  	 * // => false
  	 */
  	function isString(value) {
  	  return typeof value == 'string' ||
  	    (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
  	}

  	isString_1 = isString;
  	return isString_1;
  }

  var _asciiSize;
  var hasRequired_asciiSize;

  function require_asciiSize () {
  	if (hasRequired_asciiSize) return _asciiSize;
  	hasRequired_asciiSize = 1;
  	var baseProperty = require_baseProperty();

  	/**
  	 * Gets the size of an ASCII `string`.
  	 *
  	 * @private
  	 * @param {string} string The string inspect.
  	 * @returns {number} Returns the string size.
  	 */
  	var asciiSize = baseProperty('length');

  	_asciiSize = asciiSize;
  	return _asciiSize;
  }

  /** Used to compose unicode character classes. */

  var _hasUnicode;
  var hasRequired_hasUnicode;

  function require_hasUnicode () {
  	if (hasRequired_hasUnicode) return _hasUnicode;
  	hasRequired_hasUnicode = 1;
  	var rsAstralRange = '\\ud800-\\udfff',
  	    rsComboMarksRange = '\\u0300-\\u036f',
  	    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
  	    rsComboSymbolsRange = '\\u20d0-\\u20ff',
  	    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
  	    rsVarRange = '\\ufe0e\\ufe0f';

  	/** Used to compose unicode capture groups. */
  	var rsZWJ = '\\u200d';

  	/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
  	var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

  	/**
  	 * Checks if `string` contains Unicode symbols.
  	 *
  	 * @private
  	 * @param {string} string The string to inspect.
  	 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
  	 */
  	function hasUnicode(string) {
  	  return reHasUnicode.test(string);
  	}

  	_hasUnicode = hasUnicode;
  	return _hasUnicode;
  }

  /** Used to compose unicode character classes. */

  var _unicodeSize;
  var hasRequired_unicodeSize;

  function require_unicodeSize () {
  	if (hasRequired_unicodeSize) return _unicodeSize;
  	hasRequired_unicodeSize = 1;
  	var rsAstralRange = '\\ud800-\\udfff',
  	    rsComboMarksRange = '\\u0300-\\u036f',
  	    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
  	    rsComboSymbolsRange = '\\u20d0-\\u20ff',
  	    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
  	    rsVarRange = '\\ufe0e\\ufe0f';

  	/** Used to compose unicode capture groups. */
  	var rsAstral = '[' + rsAstralRange + ']',
  	    rsCombo = '[' + rsComboRange + ']',
  	    rsFitz = '\\ud83c[\\udffb-\\udfff]',
  	    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
  	    rsNonAstral = '[^' + rsAstralRange + ']',
  	    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
  	    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
  	    rsZWJ = '\\u200d';

  	/** Used to compose unicode regexes. */
  	var reOptMod = rsModifier + '?',
  	    rsOptVar = '[' + rsVarRange + ']?',
  	    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
  	    rsSeq = rsOptVar + reOptMod + rsOptJoin,
  	    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

  	/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
  	var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

  	/**
  	 * Gets the size of a Unicode `string`.
  	 *
  	 * @private
  	 * @param {string} string The string inspect.
  	 * @returns {number} Returns the string size.
  	 */
  	function unicodeSize(string) {
  	  var result = reUnicode.lastIndex = 0;
  	  while (reUnicode.test(string)) {
  	    ++result;
  	  }
  	  return result;
  	}

  	_unicodeSize = unicodeSize;
  	return _unicodeSize;
  }

  var _stringSize;
  var hasRequired_stringSize;

  function require_stringSize () {
  	if (hasRequired_stringSize) return _stringSize;
  	hasRequired_stringSize = 1;
  	var asciiSize = require_asciiSize(),
  	    hasUnicode = require_hasUnicode(),
  	    unicodeSize = require_unicodeSize();

  	/**
  	 * Gets the number of symbols in `string`.
  	 *
  	 * @private
  	 * @param {string} string The string to inspect.
  	 * @returns {number} Returns the string size.
  	 */
  	function stringSize(string) {
  	  return hasUnicode(string)
  	    ? unicodeSize(string)
  	    : asciiSize(string);
  	}

  	_stringSize = stringSize;
  	return _stringSize;
  }

  var size_1;
  var hasRequiredSize;

  function requireSize () {
  	if (hasRequiredSize) return size_1;
  	hasRequiredSize = 1;
  	var baseKeys = require_baseKeys(),
  	    getTag = require_getTag(),
  	    isArrayLike = requireIsArrayLike(),
  	    isString = requireIsString(),
  	    stringSize = require_stringSize();

  	/** `Object#toString` result references. */
  	var mapTag = '[object Map]',
  	    setTag = '[object Set]';

  	/**
  	 * Gets the size of `collection` by returning its length for array-like
  	 * values or the number of own enumerable string keyed properties for objects.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 0.1.0
  	 * @category Collection
  	 * @param {Array|Object|string} collection The collection to inspect.
  	 * @returns {number} Returns the collection size.
  	 * @example
  	 *
  	 * _.size([1, 2, 3]);
  	 * // => 3
  	 *
  	 * _.size({ 'a': 1, 'b': 2 });
  	 * // => 2
  	 *
  	 * _.size('pebbles');
  	 * // => 7
  	 */
  	function size(collection) {
  	  if (collection == null) {
  	    return 0;
  	  }
  	  if (isArrayLike(collection)) {
  	    return isString(collection) ? stringSize(collection) : collection.length;
  	  }
  	  var tag = getTag(collection);
  	  if (tag == mapTag || tag == setTag) {
  	    return collection.size;
  	  }
  	  return baseKeys(collection).length;
  	}

  	size_1 = size;
  	return size_1;
  }

  var transform_1;
  var hasRequiredTransform;

  function requireTransform () {
  	if (hasRequiredTransform) return transform_1;
  	hasRequiredTransform = 1;
  	var arrayEach = require_arrayEach(),
  	    baseCreate = require_baseCreate(),
  	    baseForOwn = require_baseForOwn(),
  	    baseIteratee = require_baseIteratee(),
  	    getPrototype = require_getPrototype(),
  	    isArray = requireIsArray(),
  	    isBuffer = requireIsBuffer(),
  	    isFunction = requireIsFunction(),
  	    isObject = requireIsObject(),
  	    isTypedArray = requireIsTypedArray();

  	/**
  	 * An alternative to `_.reduce`; this method transforms `object` to a new
  	 * `accumulator` object which is the result of running each of its own
  	 * enumerable string keyed properties thru `iteratee`, with each invocation
  	 * potentially mutating the `accumulator` object. If `accumulator` is not
  	 * provided, a new object with the same `[[Prototype]]` will be used. The
  	 * iteratee is invoked with four arguments: (accumulator, value, key, object).
  	 * Iteratee functions may exit iteration early by explicitly returning `false`.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 1.3.0
  	 * @category Object
  	 * @param {Object} object The object to iterate over.
  	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
  	 * @param {*} [accumulator] The custom accumulator value.
  	 * @returns {*} Returns the accumulated value.
  	 * @example
  	 *
  	 * _.transform([2, 3, 4], function(result, n) {
  	 *   result.push(n *= n);
  	 *   return n % 2 == 0;
  	 * }, []);
  	 * // => [4, 9]
  	 *
  	 * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
  	 *   (result[value] || (result[value] = [])).push(key);
  	 * }, {});
  	 * // => { '1': ['a', 'c'], '2': ['b'] }
  	 */
  	function transform(object, iteratee, accumulator) {
  	  var isArr = isArray(object),
  	      isArrLike = isArr || isBuffer(object) || isTypedArray(object);

  	  iteratee = baseIteratee(iteratee, 4);
  	  if (accumulator == null) {
  	    var Ctor = object && object.constructor;
  	    if (isArrLike) {
  	      accumulator = isArr ? new Ctor : [];
  	    }
  	    else if (isObject(object)) {
  	      accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
  	    }
  	    else {
  	      accumulator = {};
  	    }
  	  }
  	  (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object) {
  	    return iteratee(accumulator, value, index, object);
  	  });
  	  return accumulator;
  	}

  	transform_1 = transform;
  	return transform_1;
  }

  var _isFlattenable;
  var hasRequired_isFlattenable;

  function require_isFlattenable () {
  	if (hasRequired_isFlattenable) return _isFlattenable;
  	hasRequired_isFlattenable = 1;
  	var Symbol = require_Symbol(),
  	    isArguments = requireIsArguments(),
  	    isArray = requireIsArray();

  	/** Built-in value references. */
  	var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

  	/**
  	 * Checks if `value` is a flattenable `arguments` object or array.
  	 *
  	 * @private
  	 * @param {*} value The value to check.
  	 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
  	 */
  	function isFlattenable(value) {
  	  return isArray(value) || isArguments(value) ||
  	    !!(spreadableSymbol && value && value[spreadableSymbol]);
  	}

  	_isFlattenable = isFlattenable;
  	return _isFlattenable;
  }

  var _baseFlatten;
  var hasRequired_baseFlatten;

  function require_baseFlatten () {
  	if (hasRequired_baseFlatten) return _baseFlatten;
  	hasRequired_baseFlatten = 1;
  	var arrayPush = require_arrayPush(),
  	    isFlattenable = require_isFlattenable();

  	/**
  	 * The base implementation of `_.flatten` with support for restricting flattening.
  	 *
  	 * @private
  	 * @param {Array} array The array to flatten.
  	 * @param {number} depth The maximum recursion depth.
  	 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
  	 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
  	 * @param {Array} [result=[]] The initial result value.
  	 * @returns {Array} Returns the new flattened array.
  	 */
  	function baseFlatten(array, depth, predicate, isStrict, result) {
  	  var index = -1,
  	      length = array.length;

  	  predicate || (predicate = isFlattenable);
  	  result || (result = []);

  	  while (++index < length) {
  	    var value = array[index];
  	    if (depth > 0 && predicate(value)) {
  	      if (depth > 1) {
  	        // Recursively flatten arrays (susceptible to call stack limits).
  	        baseFlatten(value, depth - 1, predicate, isStrict, result);
  	      } else {
  	        arrayPush(result, value);
  	      }
  	    } else if (!isStrict) {
  	      result[result.length] = value;
  	    }
  	  }
  	  return result;
  	}

  	_baseFlatten = baseFlatten;
  	return _baseFlatten;
  }

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */

  var _apply;
  var hasRequired_apply;

  function require_apply () {
  	if (hasRequired_apply) return _apply;
  	hasRequired_apply = 1;
  	function apply(func, thisArg, args) {
  	  switch (args.length) {
  	    case 0: return func.call(thisArg);
  	    case 1: return func.call(thisArg, args[0]);
  	    case 2: return func.call(thisArg, args[0], args[1]);
  	    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  	  }
  	  return func.apply(thisArg, args);
  	}

  	_apply = apply;
  	return _apply;
  }

  var _overRest;
  var hasRequired_overRest;

  function require_overRest () {
  	if (hasRequired_overRest) return _overRest;
  	hasRequired_overRest = 1;
  	var apply = require_apply();

  	/* Built-in method references for those with the same name as other `lodash` methods. */
  	var nativeMax = Math.max;

  	/**
  	 * A specialized version of `baseRest` which transforms the rest array.
  	 *
  	 * @private
  	 * @param {Function} func The function to apply a rest parameter to.
  	 * @param {number} [start=func.length-1] The start position of the rest parameter.
  	 * @param {Function} transform The rest array transform.
  	 * @returns {Function} Returns the new function.
  	 */
  	function overRest(func, start, transform) {
  	  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  	  return function() {
  	    var args = arguments,
  	        index = -1,
  	        length = nativeMax(args.length - start, 0),
  	        array = Array(length);

  	    while (++index < length) {
  	      array[index] = args[start + index];
  	    }
  	    index = -1;
  	    var otherArgs = Array(start + 1);
  	    while (++index < start) {
  	      otherArgs[index] = args[index];
  	    }
  	    otherArgs[start] = transform(array);
  	    return apply(func, this, otherArgs);
  	  };
  	}

  	_overRest = overRest;
  	return _overRest;
  }

  var _baseSetToString;
  var hasRequired_baseSetToString;

  function require_baseSetToString () {
  	if (hasRequired_baseSetToString) return _baseSetToString;
  	hasRequired_baseSetToString = 1;
  	var constant = requireConstant(),
  	    defineProperty = require_defineProperty(),
  	    identity = requireIdentity();

  	/**
  	 * The base implementation of `setToString` without support for hot loop shorting.
  	 *
  	 * @private
  	 * @param {Function} func The function to modify.
  	 * @param {Function} string The `toString` result.
  	 * @returns {Function} Returns `func`.
  	 */
  	var baseSetToString = !defineProperty ? identity : function(func, string) {
  	  return defineProperty(func, 'toString', {
  	    'configurable': true,
  	    'enumerable': false,
  	    'value': constant(string),
  	    'writable': true
  	  });
  	};

  	_baseSetToString = baseSetToString;
  	return _baseSetToString;
  }

  /** Used to detect hot functions by number of calls within a span of milliseconds. */

  var _shortOut;
  var hasRequired_shortOut;

  function require_shortOut () {
  	if (hasRequired_shortOut) return _shortOut;
  	hasRequired_shortOut = 1;
  	var HOT_COUNT = 800,
  	    HOT_SPAN = 16;

  	/* Built-in method references for those with the same name as other `lodash` methods. */
  	var nativeNow = Date.now;

  	/**
  	 * Creates a function that'll short out and invoke `identity` instead
  	 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
  	 * milliseconds.
  	 *
  	 * @private
  	 * @param {Function} func The function to restrict.
  	 * @returns {Function} Returns the new shortable function.
  	 */
  	function shortOut(func) {
  	  var count = 0,
  	      lastCalled = 0;

  	  return function() {
  	    var stamp = nativeNow(),
  	        remaining = HOT_SPAN - (stamp - lastCalled);

  	    lastCalled = stamp;
  	    if (remaining > 0) {
  	      if (++count >= HOT_COUNT) {
  	        return arguments[0];
  	      }
  	    } else {
  	      count = 0;
  	    }
  	    return func.apply(undefined, arguments);
  	  };
  	}

  	_shortOut = shortOut;
  	return _shortOut;
  }

  var _setToString;
  var hasRequired_setToString;

  function require_setToString () {
  	if (hasRequired_setToString) return _setToString;
  	hasRequired_setToString = 1;
  	var baseSetToString = require_baseSetToString(),
  	    shortOut = require_shortOut();

  	/**
  	 * Sets the `toString` method of `func` to return `string`.
  	 *
  	 * @private
  	 * @param {Function} func The function to modify.
  	 * @param {Function} string The `toString` result.
  	 * @returns {Function} Returns `func`.
  	 */
  	var setToString = shortOut(baseSetToString);

  	_setToString = setToString;
  	return _setToString;
  }

  var _baseRest;
  var hasRequired_baseRest;

  function require_baseRest () {
  	if (hasRequired_baseRest) return _baseRest;
  	hasRequired_baseRest = 1;
  	var identity = requireIdentity(),
  	    overRest = require_overRest(),
  	    setToString = require_setToString();

  	/**
  	 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
  	 *
  	 * @private
  	 * @param {Function} func The function to apply a rest parameter to.
  	 * @param {number} [start=func.length-1] The start position of the rest parameter.
  	 * @returns {Function} Returns the new function.
  	 */
  	function baseRest(func, start) {
  	  return setToString(overRest(func, start, identity), func + '');
  	}

  	_baseRest = baseRest;
  	return _baseRest;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */

  var _baseFindIndex;
  var hasRequired_baseFindIndex;

  function require_baseFindIndex () {
  	if (hasRequired_baseFindIndex) return _baseFindIndex;
  	hasRequired_baseFindIndex = 1;
  	function baseFindIndex(array, predicate, fromIndex, fromRight) {
  	  var length = array.length,
  	      index = fromIndex + (fromRight ? 1 : -1);

  	  while ((fromRight ? index-- : ++index < length)) {
  	    if (predicate(array[index], index, array)) {
  	      return index;
  	    }
  	  }
  	  return -1;
  	}

  	_baseFindIndex = baseFindIndex;
  	return _baseFindIndex;
  }

  /**
   * The base implementation of `_.isNaN` without support for number objects.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
   */

  var _baseIsNaN;
  var hasRequired_baseIsNaN;

  function require_baseIsNaN () {
  	if (hasRequired_baseIsNaN) return _baseIsNaN;
  	hasRequired_baseIsNaN = 1;
  	function baseIsNaN(value) {
  	  return value !== value;
  	}

  	_baseIsNaN = baseIsNaN;
  	return _baseIsNaN;
  }

  /**
   * A specialized version of `_.indexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */

  var _strictIndexOf;
  var hasRequired_strictIndexOf;

  function require_strictIndexOf () {
  	if (hasRequired_strictIndexOf) return _strictIndexOf;
  	hasRequired_strictIndexOf = 1;
  	function strictIndexOf(array, value, fromIndex) {
  	  var index = fromIndex - 1,
  	      length = array.length;

  	  while (++index < length) {
  	    if (array[index] === value) {
  	      return index;
  	    }
  	  }
  	  return -1;
  	}

  	_strictIndexOf = strictIndexOf;
  	return _strictIndexOf;
  }

  var _baseIndexOf;
  var hasRequired_baseIndexOf;

  function require_baseIndexOf () {
  	if (hasRequired_baseIndexOf) return _baseIndexOf;
  	hasRequired_baseIndexOf = 1;
  	var baseFindIndex = require_baseFindIndex(),
  	    baseIsNaN = require_baseIsNaN(),
  	    strictIndexOf = require_strictIndexOf();

  	/**
  	 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
  	 *
  	 * @private
  	 * @param {Array} array The array to inspect.
  	 * @param {*} value The value to search for.
  	 * @param {number} fromIndex The index to search from.
  	 * @returns {number} Returns the index of the matched value, else `-1`.
  	 */
  	function baseIndexOf(array, value, fromIndex) {
  	  return value === value
  	    ? strictIndexOf(array, value, fromIndex)
  	    : baseFindIndex(array, baseIsNaN, fromIndex);
  	}

  	_baseIndexOf = baseIndexOf;
  	return _baseIndexOf;
  }

  var _arrayIncludes;
  var hasRequired_arrayIncludes;

  function require_arrayIncludes () {
  	if (hasRequired_arrayIncludes) return _arrayIncludes;
  	hasRequired_arrayIncludes = 1;
  	var baseIndexOf = require_baseIndexOf();

  	/**
  	 * A specialized version of `_.includes` for arrays without support for
  	 * specifying an index to search from.
  	 *
  	 * @private
  	 * @param {Array} [array] The array to inspect.
  	 * @param {*} target The value to search for.
  	 * @returns {boolean} Returns `true` if `target` is found, else `false`.
  	 */
  	function arrayIncludes(array, value) {
  	  var length = array == null ? 0 : array.length;
  	  return !!length && baseIndexOf(array, value, 0) > -1;
  	}

  	_arrayIncludes = arrayIncludes;
  	return _arrayIncludes;
  }

  /**
   * This function is like `arrayIncludes` except that it accepts a comparator.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */

  var _arrayIncludesWith;
  var hasRequired_arrayIncludesWith;

  function require_arrayIncludesWith () {
  	if (hasRequired_arrayIncludesWith) return _arrayIncludesWith;
  	hasRequired_arrayIncludesWith = 1;
  	function arrayIncludesWith(array, value, comparator) {
  	  var index = -1,
  	      length = array == null ? 0 : array.length;

  	  while (++index < length) {
  	    if (comparator(value, array[index])) {
  	      return true;
  	    }
  	  }
  	  return false;
  	}

  	_arrayIncludesWith = arrayIncludesWith;
  	return _arrayIncludesWith;
  }

  /**
   * This method returns `undefined`.
   *
   * @static
   * @memberOf _
   * @since 2.3.0
   * @category Util
   * @example
   *
   * _.times(2, _.noop);
   * // => [undefined, undefined]
   */

  var noop_1;
  var hasRequiredNoop;

  function requireNoop () {
  	if (hasRequiredNoop) return noop_1;
  	hasRequiredNoop = 1;
  	function noop() {
  	  // No operation performed.
  	}

  	noop_1 = noop;
  	return noop_1;
  }

  var _createSet;
  var hasRequired_createSet;

  function require_createSet () {
  	if (hasRequired_createSet) return _createSet;
  	hasRequired_createSet = 1;
  	var Set = require_Set(),
  	    noop = requireNoop(),
  	    setToArray = require_setToArray();

  	/** Used as references for various `Number` constants. */
  	var INFINITY = 1 / 0;

  	/**
  	 * Creates a set object of `values`.
  	 *
  	 * @private
  	 * @param {Array} values The values to add to the set.
  	 * @returns {Object} Returns the new set.
  	 */
  	var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
  	  return new Set(values);
  	};

  	_createSet = createSet;
  	return _createSet;
  }

  var _baseUniq;
  var hasRequired_baseUniq;

  function require_baseUniq () {
  	if (hasRequired_baseUniq) return _baseUniq;
  	hasRequired_baseUniq = 1;
  	var SetCache = require_SetCache(),
  	    arrayIncludes = require_arrayIncludes(),
  	    arrayIncludesWith = require_arrayIncludesWith(),
  	    cacheHas = require_cacheHas(),
  	    createSet = require_createSet(),
  	    setToArray = require_setToArray();

  	/** Used as the size to enable large array optimizations. */
  	var LARGE_ARRAY_SIZE = 200;

  	/**
  	 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
  	 *
  	 * @private
  	 * @param {Array} array The array to inspect.
  	 * @param {Function} [iteratee] The iteratee invoked per element.
  	 * @param {Function} [comparator] The comparator invoked per element.
  	 * @returns {Array} Returns the new duplicate free array.
  	 */
  	function baseUniq(array, iteratee, comparator) {
  	  var index = -1,
  	      includes = arrayIncludes,
  	      length = array.length,
  	      isCommon = true,
  	      result = [],
  	      seen = result;

  	  if (comparator) {
  	    isCommon = false;
  	    includes = arrayIncludesWith;
  	  }
  	  else if (length >= LARGE_ARRAY_SIZE) {
  	    var set = iteratee ? null : createSet(array);
  	    if (set) {
  	      return setToArray(set);
  	    }
  	    isCommon = false;
  	    includes = cacheHas;
  	    seen = new SetCache;
  	  }
  	  else {
  	    seen = iteratee ? [] : result;
  	  }
  	  outer:
  	  while (++index < length) {
  	    var value = array[index],
  	        computed = iteratee ? iteratee(value) : value;

  	    value = (comparator || value !== 0) ? value : 0;
  	    if (isCommon && computed === computed) {
  	      var seenIndex = seen.length;
  	      while (seenIndex--) {
  	        if (seen[seenIndex] === computed) {
  	          continue outer;
  	        }
  	      }
  	      if (iteratee) {
  	        seen.push(computed);
  	      }
  	      result.push(value);
  	    }
  	    else if (!includes(seen, computed, comparator)) {
  	      if (seen !== result) {
  	        seen.push(computed);
  	      }
  	      result.push(value);
  	    }
  	  }
  	  return result;
  	}

  	_baseUniq = baseUniq;
  	return _baseUniq;
  }

  var isArrayLikeObject_1;
  var hasRequiredIsArrayLikeObject;

  function requireIsArrayLikeObject () {
  	if (hasRequiredIsArrayLikeObject) return isArrayLikeObject_1;
  	hasRequiredIsArrayLikeObject = 1;
  	var isArrayLike = requireIsArrayLike(),
  	    isObjectLike = requireIsObjectLike();

  	/**
  	 * This method is like `_.isArrayLike` except that it also checks if `value`
  	 * is an object.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 4.0.0
  	 * @category Lang
  	 * @param {*} value The value to check.
  	 * @returns {boolean} Returns `true` if `value` is an array-like object,
  	 *  else `false`.
  	 * @example
  	 *
  	 * _.isArrayLikeObject([1, 2, 3]);
  	 * // => true
  	 *
  	 * _.isArrayLikeObject(document.body.children);
  	 * // => true
  	 *
  	 * _.isArrayLikeObject('abc');
  	 * // => false
  	 *
  	 * _.isArrayLikeObject(_.noop);
  	 * // => false
  	 */
  	function isArrayLikeObject(value) {
  	  return isObjectLike(value) && isArrayLike(value);
  	}

  	isArrayLikeObject_1 = isArrayLikeObject;
  	return isArrayLikeObject_1;
  }

  var union_1;
  var hasRequiredUnion;

  function requireUnion () {
  	if (hasRequiredUnion) return union_1;
  	hasRequiredUnion = 1;
  	var baseFlatten = require_baseFlatten(),
  	    baseRest = require_baseRest(),
  	    baseUniq = require_baseUniq(),
  	    isArrayLikeObject = requireIsArrayLikeObject();

  	/**
  	 * Creates an array of unique values, in order, from all given arrays using
  	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
  	 * for equality comparisons.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 0.1.0
  	 * @category Array
  	 * @param {...Array} [arrays] The arrays to inspect.
  	 * @returns {Array} Returns the new array of combined values.
  	 * @example
  	 *
  	 * _.union([2], [1, 2]);
  	 * // => [2, 1]
  	 */
  	var union = baseRest(function(arrays) {
  	  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
  	});

  	union_1 = union;
  	return union_1;
  }

  var _baseValues;
  var hasRequired_baseValues;

  function require_baseValues () {
  	if (hasRequired_baseValues) return _baseValues;
  	hasRequired_baseValues = 1;
  	var arrayMap = require_arrayMap();

  	/**
  	 * The base implementation of `_.values` and `_.valuesIn` which creates an
  	 * array of `object` property values corresponding to the property names
  	 * of `props`.
  	 *
  	 * @private
  	 * @param {Object} object The object to query.
  	 * @param {Array} props The property names to get values for.
  	 * @returns {Object} Returns the array of property values.
  	 */
  	function baseValues(object, props) {
  	  return arrayMap(props, function(key) {
  	    return object[key];
  	  });
  	}

  	_baseValues = baseValues;
  	return _baseValues;
  }

  var values_1;
  var hasRequiredValues;

  function requireValues () {
  	if (hasRequiredValues) return values_1;
  	hasRequiredValues = 1;
  	var baseValues = require_baseValues(),
  	    keys = requireKeys();

  	/**
  	 * Creates an array of the own enumerable string keyed property values of `object`.
  	 *
  	 * **Note:** Non-object values are coerced to objects.
  	 *
  	 * @static
  	 * @since 0.1.0
  	 * @memberOf _
  	 * @category Object
  	 * @param {Object} object The object to query.
  	 * @returns {Array} Returns the array of property values.
  	 * @example
  	 *
  	 * function Foo() {
  	 *   this.a = 1;
  	 *   this.b = 2;
  	 * }
  	 *
  	 * Foo.prototype.c = 3;
  	 *
  	 * _.values(new Foo);
  	 * // => [1, 2] (iteration order is not guaranteed)
  	 *
  	 * _.values('hi');
  	 * // => ['h', 'i']
  	 */
  	function values(object) {
  	  return object == null ? [] : baseValues(object, keys(object));
  	}

  	values_1 = values;
  	return values_1;
  }

  /* global window */

  var lodash_1$1;
  var hasRequiredLodash$1;

  function requireLodash$1 () {
  	if (hasRequiredLodash$1) return lodash_1$1;
  	hasRequiredLodash$1 = 1;
  	var lodash;

  	if (typeof commonjsRequire === "function") {
  	  try {
  	    lodash = {
  	      clone: requireClone(),
  	      constant: requireConstant(),
  	      each: requireEach(),
  	      filter: requireFilter(),
  	      has:  requireHas(),
  	      isArray: requireIsArray(),
  	      isEmpty: requireIsEmpty(),
  	      isFunction: requireIsFunction(),
  	      isUndefined: requireIsUndefined(),
  	      keys: requireKeys(),
  	      map: requireMap(),
  	      reduce: requireReduce(),
  	      size: requireSize(),
  	      transform: requireTransform(),
  	      union: requireUnion(),
  	      values: requireValues()
  	    };
  	  } catch (e) {
  	    // continue regardless of error
  	  }
  	}

  	if (!lodash) {
  	  lodash = window._;
  	}

  	lodash_1$1 = lodash;
  	return lodash_1$1;
  }

  var graph;
  var hasRequiredGraph;

  function requireGraph () {
  	if (hasRequiredGraph) return graph;
  	hasRequiredGraph = 1;

  	var _ = requireLodash$1();

  	graph = Graph;

  	var DEFAULT_EDGE_NAME = "\x00";
  	var GRAPH_NODE = "\x00";
  	var EDGE_KEY_DELIM = "\x01";

  	// Implementation notes:
  	//
  	//  * Node id query functions should return string ids for the nodes
  	//  * Edge id query functions should return an "edgeObj", edge object, that is
  	//    composed of enough information to uniquely identify an edge: {v, w, name}.
  	//  * Internally we use an "edgeId", a stringified form of the edgeObj, to
  	//    reference edges. This is because we need a performant way to look these
  	//    edges up and, object properties, which have string keys, are the closest
  	//    we're going to get to a performant hashtable in JavaScript.

  	function Graph(opts) {
  	  this._isDirected = _.has(opts, "directed") ? opts.directed : true;
  	  this._isMultigraph = _.has(opts, "multigraph") ? opts.multigraph : false;
  	  this._isCompound = _.has(opts, "compound") ? opts.compound : false;

  	  // Label for the graph itself
  	  this._label = undefined;

  	  // Defaults to be set when creating a new node
  	  this._defaultNodeLabelFn = _.constant(undefined);

  	  // Defaults to be set when creating a new edge
  	  this._defaultEdgeLabelFn = _.constant(undefined);

  	  // v -> label
  	  this._nodes = {};

  	  if (this._isCompound) {
  	    // v -> parent
  	    this._parent = {};

  	    // v -> children
  	    this._children = {};
  	    this._children[GRAPH_NODE] = {};
  	  }

  	  // v -> edgeObj
  	  this._in = {};

  	  // u -> v -> Number
  	  this._preds = {};

  	  // v -> edgeObj
  	  this._out = {};

  	  // v -> w -> Number
  	  this._sucs = {};

  	  // e -> edgeObj
  	  this._edgeObjs = {};

  	  // e -> label
  	  this._edgeLabels = {};
  	}

  	/* Number of nodes in the graph. Should only be changed by the implementation. */
  	Graph.prototype._nodeCount = 0;

  	/* Number of edges in the graph. Should only be changed by the implementation. */
  	Graph.prototype._edgeCount = 0;


  	/* === Graph functions ========= */

  	Graph.prototype.isDirected = function() {
  	  return this._isDirected;
  	};

  	Graph.prototype.isMultigraph = function() {
  	  return this._isMultigraph;
  	};

  	Graph.prototype.isCompound = function() {
  	  return this._isCompound;
  	};

  	Graph.prototype.setGraph = function(label) {
  	  this._label = label;
  	  return this;
  	};

  	Graph.prototype.graph = function() {
  	  return this._label;
  	};


  	/* === Node functions ========== */

  	Graph.prototype.setDefaultNodeLabel = function(newDefault) {
  	  if (!_.isFunction(newDefault)) {
  	    newDefault = _.constant(newDefault);
  	  }
  	  this._defaultNodeLabelFn = newDefault;
  	  return this;
  	};

  	Graph.prototype.nodeCount = function() {
  	  return this._nodeCount;
  	};

  	Graph.prototype.nodes = function() {
  	  return _.keys(this._nodes);
  	};

  	Graph.prototype.sources = function() {
  	  var self = this;
  	  return _.filter(this.nodes(), function(v) {
  	    return _.isEmpty(self._in[v]);
  	  });
  	};

  	Graph.prototype.sinks = function() {
  	  var self = this;
  	  return _.filter(this.nodes(), function(v) {
  	    return _.isEmpty(self._out[v]);
  	  });
  	};

  	Graph.prototype.setNodes = function(vs, value) {
  	  var args = arguments;
  	  var self = this;
  	  _.each(vs, function(v) {
  	    if (args.length > 1) {
  	      self.setNode(v, value);
  	    } else {
  	      self.setNode(v);
  	    }
  	  });
  	  return this;
  	};

  	Graph.prototype.setNode = function(v, value) {
  	  if (_.has(this._nodes, v)) {
  	    if (arguments.length > 1) {
  	      this._nodes[v] = value;
  	    }
  	    return this;
  	  }

  	  this._nodes[v] = arguments.length > 1 ? value : this._defaultNodeLabelFn(v);
  	  if (this._isCompound) {
  	    this._parent[v] = GRAPH_NODE;
  	    this._children[v] = {};
  	    this._children[GRAPH_NODE][v] = true;
  	  }
  	  this._in[v] = {};
  	  this._preds[v] = {};
  	  this._out[v] = {};
  	  this._sucs[v] = {};
  	  ++this._nodeCount;
  	  return this;
  	};

  	Graph.prototype.node = function(v) {
  	  return this._nodes[v];
  	};

  	Graph.prototype.hasNode = function(v) {
  	  return _.has(this._nodes, v);
  	};

  	Graph.prototype.removeNode =  function(v) {
  	  var self = this;
  	  if (_.has(this._nodes, v)) {
  	    var removeEdge = function(e) { self.removeEdge(self._edgeObjs[e]); };
  	    delete this._nodes[v];
  	    if (this._isCompound) {
  	      this._removeFromParentsChildList(v);
  	      delete this._parent[v];
  	      _.each(this.children(v), function(child) {
  	        self.setParent(child);
  	      });
  	      delete this._children[v];
  	    }
  	    _.each(_.keys(this._in[v]), removeEdge);
  	    delete this._in[v];
  	    delete this._preds[v];
  	    _.each(_.keys(this._out[v]), removeEdge);
  	    delete this._out[v];
  	    delete this._sucs[v];
  	    --this._nodeCount;
  	  }
  	  return this;
  	};

  	Graph.prototype.setParent = function(v, parent) {
  	  if (!this._isCompound) {
  	    throw new Error("Cannot set parent in a non-compound graph");
  	  }

  	  if (_.isUndefined(parent)) {
  	    parent = GRAPH_NODE;
  	  } else {
  	    // Coerce parent to string
  	    parent += "";
  	    for (var ancestor = parent;
  	      !_.isUndefined(ancestor);
  	      ancestor = this.parent(ancestor)) {
  	      if (ancestor === v) {
  	        throw new Error("Setting " + parent+ " as parent of " + v +
  	                        " would create a cycle");
  	      }
  	    }

  	    this.setNode(parent);
  	  }

  	  this.setNode(v);
  	  this._removeFromParentsChildList(v);
  	  this._parent[v] = parent;
  	  this._children[parent][v] = true;
  	  return this;
  	};

  	Graph.prototype._removeFromParentsChildList = function(v) {
  	  delete this._children[this._parent[v]][v];
  	};

  	Graph.prototype.parent = function(v) {
  	  if (this._isCompound) {
  	    var parent = this._parent[v];
  	    if (parent !== GRAPH_NODE) {
  	      return parent;
  	    }
  	  }
  	};

  	Graph.prototype.children = function(v) {
  	  if (_.isUndefined(v)) {
  	    v = GRAPH_NODE;
  	  }

  	  if (this._isCompound) {
  	    var children = this._children[v];
  	    if (children) {
  	      return _.keys(children);
  	    }
  	  } else if (v === GRAPH_NODE) {
  	    return this.nodes();
  	  } else if (this.hasNode(v)) {
  	    return [];
  	  }
  	};

  	Graph.prototype.predecessors = function(v) {
  	  var predsV = this._preds[v];
  	  if (predsV) {
  	    return _.keys(predsV);
  	  }
  	};

  	Graph.prototype.successors = function(v) {
  	  var sucsV = this._sucs[v];
  	  if (sucsV) {
  	    return _.keys(sucsV);
  	  }
  	};

  	Graph.prototype.neighbors = function(v) {
  	  var preds = this.predecessors(v);
  	  if (preds) {
  	    return _.union(preds, this.successors(v));
  	  }
  	};

  	Graph.prototype.isLeaf = function (v) {
  	  var neighbors;
  	  if (this.isDirected()) {
  	    neighbors = this.successors(v);
  	  } else {
  	    neighbors = this.neighbors(v);
  	  }
  	  return neighbors.length === 0;
  	};

  	Graph.prototype.filterNodes = function(filter) {
  	  var copy = new this.constructor({
  	    directed: this._isDirected,
  	    multigraph: this._isMultigraph,
  	    compound: this._isCompound
  	  });

  	  copy.setGraph(this.graph());

  	  var self = this;
  	  _.each(this._nodes, function(value, v) {
  	    if (filter(v)) {
  	      copy.setNode(v, value);
  	    }
  	  });

  	  _.each(this._edgeObjs, function(e) {
  	    if (copy.hasNode(e.v) && copy.hasNode(e.w)) {
  	      copy.setEdge(e, self.edge(e));
  	    }
  	  });

  	  var parents = {};
  	  function findParent(v) {
  	    var parent = self.parent(v);
  	    if (parent === undefined || copy.hasNode(parent)) {
  	      parents[v] = parent;
  	      return parent;
  	    } else if (parent in parents) {
  	      return parents[parent];
  	    } else {
  	      return findParent(parent);
  	    }
  	  }

  	  if (this._isCompound) {
  	    _.each(copy.nodes(), function(v) {
  	      copy.setParent(v, findParent(v));
  	    });
  	  }

  	  return copy;
  	};

  	/* === Edge functions ========== */

  	Graph.prototype.setDefaultEdgeLabel = function(newDefault) {
  	  if (!_.isFunction(newDefault)) {
  	    newDefault = _.constant(newDefault);
  	  }
  	  this._defaultEdgeLabelFn = newDefault;
  	  return this;
  	};

  	Graph.prototype.edgeCount = function() {
  	  return this._edgeCount;
  	};

  	Graph.prototype.edges = function() {
  	  return _.values(this._edgeObjs);
  	};

  	Graph.prototype.setPath = function(vs, value) {
  	  var self = this;
  	  var args = arguments;
  	  _.reduce(vs, function(v, w) {
  	    if (args.length > 1) {
  	      self.setEdge(v, w, value);
  	    } else {
  	      self.setEdge(v, w);
  	    }
  	    return w;
  	  });
  	  return this;
  	};

  	/*
  	 * setEdge(v, w, [value, [name]])
  	 * setEdge({ v, w, [name] }, [value])
  	 */
  	Graph.prototype.setEdge = function() {
  	  var v, w, name, value;
  	  var valueSpecified = false;
  	  var arg0 = arguments[0];

  	  if (typeof arg0 === "object" && arg0 !== null && "v" in arg0) {
  	    v = arg0.v;
  	    w = arg0.w;
  	    name = arg0.name;
  	    if (arguments.length === 2) {
  	      value = arguments[1];
  	      valueSpecified = true;
  	    }
  	  } else {
  	    v = arg0;
  	    w = arguments[1];
  	    name = arguments[3];
  	    if (arguments.length > 2) {
  	      value = arguments[2];
  	      valueSpecified = true;
  	    }
  	  }

  	  v = "" + v;
  	  w = "" + w;
  	  if (!_.isUndefined(name)) {
  	    name = "" + name;
  	  }

  	  var e = edgeArgsToId(this._isDirected, v, w, name);
  	  if (_.has(this._edgeLabels, e)) {
  	    if (valueSpecified) {
  	      this._edgeLabels[e] = value;
  	    }
  	    return this;
  	  }

  	  if (!_.isUndefined(name) && !this._isMultigraph) {
  	    throw new Error("Cannot set a named edge when isMultigraph = false");
  	  }

  	  // It didn't exist, so we need to create it.
  	  // First ensure the nodes exist.
  	  this.setNode(v);
  	  this.setNode(w);

  	  this._edgeLabels[e] = valueSpecified ? value : this._defaultEdgeLabelFn(v, w, name);

  	  var edgeObj = edgeArgsToObj(this._isDirected, v, w, name);
  	  // Ensure we add undirected edges in a consistent way.
  	  v = edgeObj.v;
  	  w = edgeObj.w;

  	  Object.freeze(edgeObj);
  	  this._edgeObjs[e] = edgeObj;
  	  incrementOrInitEntry(this._preds[w], v);
  	  incrementOrInitEntry(this._sucs[v], w);
  	  this._in[w][e] = edgeObj;
  	  this._out[v][e] = edgeObj;
  	  this._edgeCount++;
  	  return this;
  	};

  	Graph.prototype.edge = function(v, w, name) {
  	  var e = (arguments.length === 1
  	    ? edgeObjToId(this._isDirected, arguments[0])
  	    : edgeArgsToId(this._isDirected, v, w, name));
  	  return this._edgeLabels[e];
  	};

  	Graph.prototype.hasEdge = function(v, w, name) {
  	  var e = (arguments.length === 1
  	    ? edgeObjToId(this._isDirected, arguments[0])
  	    : edgeArgsToId(this._isDirected, v, w, name));
  	  return _.has(this._edgeLabels, e);
  	};

  	Graph.prototype.removeEdge = function(v, w, name) {
  	  var e = (arguments.length === 1
  	    ? edgeObjToId(this._isDirected, arguments[0])
  	    : edgeArgsToId(this._isDirected, v, w, name));
  	  var edge = this._edgeObjs[e];
  	  if (edge) {
  	    v = edge.v;
  	    w = edge.w;
  	    delete this._edgeLabels[e];
  	    delete this._edgeObjs[e];
  	    decrementOrRemoveEntry(this._preds[w], v);
  	    decrementOrRemoveEntry(this._sucs[v], w);
  	    delete this._in[w][e];
  	    delete this._out[v][e];
  	    this._edgeCount--;
  	  }
  	  return this;
  	};

  	Graph.prototype.inEdges = function(v, u) {
  	  var inV = this._in[v];
  	  if (inV) {
  	    var edges = _.values(inV);
  	    if (!u) {
  	      return edges;
  	    }
  	    return _.filter(edges, function(edge) { return edge.v === u; });
  	  }
  	};

  	Graph.prototype.outEdges = function(v, w) {
  	  var outV = this._out[v];
  	  if (outV) {
  	    var edges = _.values(outV);
  	    if (!w) {
  	      return edges;
  	    }
  	    return _.filter(edges, function(edge) { return edge.w === w; });
  	  }
  	};

  	Graph.prototype.nodeEdges = function(v, w) {
  	  var inEdges = this.inEdges(v, w);
  	  if (inEdges) {
  	    return inEdges.concat(this.outEdges(v, w));
  	  }
  	};

  	function incrementOrInitEntry(map, k) {
  	  if (map[k]) {
  	    map[k]++;
  	  } else {
  	    map[k] = 1;
  	  }
  	}

  	function decrementOrRemoveEntry(map, k) {
  	  if (!--map[k]) { delete map[k]; }
  	}

  	function edgeArgsToId(isDirected, v_, w_, name) {
  	  var v = "" + v_;
  	  var w = "" + w_;
  	  if (!isDirected && v > w) {
  	    var tmp = v;
  	    v = w;
  	    w = tmp;
  	  }
  	  return v + EDGE_KEY_DELIM + w + EDGE_KEY_DELIM +
  	             (_.isUndefined(name) ? DEFAULT_EDGE_NAME : name);
  	}

  	function edgeArgsToObj(isDirected, v_, w_, name) {
  	  var v = "" + v_;
  	  var w = "" + w_;
  	  if (!isDirected && v > w) {
  	    var tmp = v;
  	    v = w;
  	    w = tmp;
  	  }
  	  var edgeObj =  { v: v, w: w };
  	  if (name) {
  	    edgeObj.name = name;
  	  }
  	  return edgeObj;
  	}

  	function edgeObjToId(isDirected, edgeObj) {
  	  return edgeArgsToId(isDirected, edgeObj.v, edgeObj.w, edgeObj.name);
  	}
  	return graph;
  }

  var version$1;
  var hasRequiredVersion$1;

  function requireVersion$1 () {
  	if (hasRequiredVersion$1) return version$1;
  	hasRequiredVersion$1 = 1;
  	version$1 = '2.1.8';
  	return version$1;
  }

  var lib;
  var hasRequiredLib;

  function requireLib () {
  	if (hasRequiredLib) return lib;
  	hasRequiredLib = 1;
  	// Includes only the "core" of graphlib
  	lib = {
  	  Graph: requireGraph(),
  	  version: requireVersion$1()
  	};
  	return lib;
  }

  var json;
  var hasRequiredJson;

  function requireJson () {
  	if (hasRequiredJson) return json;
  	hasRequiredJson = 1;
  	var _ = requireLodash$1();
  	var Graph = requireGraph();

  	json = {
  	  write: write,
  	  read: read
  	};

  	function write(g) {
  	  var json = {
  	    options: {
  	      directed: g.isDirected(),
  	      multigraph: g.isMultigraph(),
  	      compound: g.isCompound()
  	    },
  	    nodes: writeNodes(g),
  	    edges: writeEdges(g)
  	  };
  	  if (!_.isUndefined(g.graph())) {
  	    json.value = _.clone(g.graph());
  	  }
  	  return json;
  	}

  	function writeNodes(g) {
  	  return _.map(g.nodes(), function(v) {
  	    var nodeValue = g.node(v);
  	    var parent = g.parent(v);
  	    var node = { v: v };
  	    if (!_.isUndefined(nodeValue)) {
  	      node.value = nodeValue;
  	    }
  	    if (!_.isUndefined(parent)) {
  	      node.parent = parent;
  	    }
  	    return node;
  	  });
  	}

  	function writeEdges(g) {
  	  return _.map(g.edges(), function(e) {
  	    var edgeValue = g.edge(e);
  	    var edge = { v: e.v, w: e.w };
  	    if (!_.isUndefined(e.name)) {
  	      edge.name = e.name;
  	    }
  	    if (!_.isUndefined(edgeValue)) {
  	      edge.value = edgeValue;
  	    }
  	    return edge;
  	  });
  	}

  	function read(json) {
  	  var g = new Graph(json.options).setGraph(json.value);
  	  _.each(json.nodes, function(entry) {
  	    g.setNode(entry.v, entry.value);
  	    if (entry.parent) {
  	      g.setParent(entry.v, entry.parent);
  	    }
  	  });
  	  _.each(json.edges, function(entry) {
  	    g.setEdge({ v: entry.v, w: entry.w, name: entry.name }, entry.value);
  	  });
  	  return g;
  	}
  	return json;
  }

  var components_1;
  var hasRequiredComponents;

  function requireComponents () {
  	if (hasRequiredComponents) return components_1;
  	hasRequiredComponents = 1;
  	var _ = requireLodash$1();

  	components_1 = components;

  	function components(g) {
  	  var visited = {};
  	  var cmpts = [];
  	  var cmpt;

  	  function dfs(v) {
  	    if (_.has(visited, v)) return;
  	    visited[v] = true;
  	    cmpt.push(v);
  	    _.each(g.successors(v), dfs);
  	    _.each(g.predecessors(v), dfs);
  	  }

  	  _.each(g.nodes(), function(v) {
  	    cmpt = [];
  	    dfs(v);
  	    if (cmpt.length) {
  	      cmpts.push(cmpt);
  	    }
  	  });

  	  return cmpts;
  	}
  	return components_1;
  }

  var priorityQueue;
  var hasRequiredPriorityQueue;

  function requirePriorityQueue () {
  	if (hasRequiredPriorityQueue) return priorityQueue;
  	hasRequiredPriorityQueue = 1;
  	var _ = requireLodash$1();

  	priorityQueue = PriorityQueue;

  	/**
  	 * A min-priority queue data structure. This algorithm is derived from Cormen,
  	 * et al., "Introduction to Algorithms". The basic idea of a min-priority
  	 * queue is that you can efficiently (in O(1) time) get the smallest key in
  	 * the queue. Adding and removing elements takes O(log n) time. A key can
  	 * have its priority decreased in O(log n) time.
  	 */
  	function PriorityQueue() {
  	  this._arr = [];
  	  this._keyIndices = {};
  	}

  	/**
  	 * Returns the number of elements in the queue. Takes `O(1)` time.
  	 */
  	PriorityQueue.prototype.size = function() {
  	  return this._arr.length;
  	};

  	/**
  	 * Returns the keys that are in the queue. Takes `O(n)` time.
  	 */
  	PriorityQueue.prototype.keys = function() {
  	  return this._arr.map(function(x) { return x.key; });
  	};

  	/**
  	 * Returns `true` if **key** is in the queue and `false` if not.
  	 */
  	PriorityQueue.prototype.has = function(key) {
  	  return _.has(this._keyIndices, key);
  	};

  	/**
  	 * Returns the priority for **key**. If **key** is not present in the queue
  	 * then this function returns `undefined`. Takes `O(1)` time.
  	 *
  	 * @param {Object} key
  	 */
  	PriorityQueue.prototype.priority = function(key) {
  	  var index = this._keyIndices[key];
  	  if (index !== undefined) {
  	    return this._arr[index].priority;
  	  }
  	};

  	/**
  	 * Returns the key for the minimum element in this queue. If the queue is
  	 * empty this function throws an Error. Takes `O(1)` time.
  	 */
  	PriorityQueue.prototype.min = function() {
  	  if (this.size() === 0) {
  	    throw new Error("Queue underflow");
  	  }
  	  return this._arr[0].key;
  	};

  	/**
  	 * Inserts a new key into the priority queue. If the key already exists in
  	 * the queue this function returns `false`; otherwise it will return `true`.
  	 * Takes `O(n)` time.
  	 *
  	 * @param {Object} key the key to add
  	 * @param {Number} priority the initial priority for the key
  	 */
  	PriorityQueue.prototype.add = function(key, priority) {
  	  var keyIndices = this._keyIndices;
  	  key = String(key);
  	  if (!_.has(keyIndices, key)) {
  	    var arr = this._arr;
  	    var index = arr.length;
  	    keyIndices[key] = index;
  	    arr.push({key: key, priority: priority});
  	    this._decrease(index);
  	    return true;
  	  }
  	  return false;
  	};

  	/**
  	 * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
  	 */
  	PriorityQueue.prototype.removeMin = function() {
  	  this._swap(0, this._arr.length - 1);
  	  var min = this._arr.pop();
  	  delete this._keyIndices[min.key];
  	  this._heapify(0);
  	  return min.key;
  	};

  	/**
  	 * Decreases the priority for **key** to **priority**. If the new priority is
  	 * greater than the previous priority, this function will throw an Error.
  	 *
  	 * @param {Object} key the key for which to raise priority
  	 * @param {Number} priority the new priority for the key
  	 */
  	PriorityQueue.prototype.decrease = function(key, priority) {
  	  var index = this._keyIndices[key];
  	  if (priority > this._arr[index].priority) {
  	    throw new Error("New priority is greater than current priority. " +
  	        "Key: " + key + " Old: " + this._arr[index].priority + " New: " + priority);
  	  }
  	  this._arr[index].priority = priority;
  	  this._decrease(index);
  	};

  	PriorityQueue.prototype._heapify = function(i) {
  	  var arr = this._arr;
  	  var l = 2 * i;
  	  var r = l + 1;
  	  var largest = i;
  	  if (l < arr.length) {
  	    largest = arr[l].priority < arr[largest].priority ? l : largest;
  	    if (r < arr.length) {
  	      largest = arr[r].priority < arr[largest].priority ? r : largest;
  	    }
  	    if (largest !== i) {
  	      this._swap(i, largest);
  	      this._heapify(largest);
  	    }
  	  }
  	};

  	PriorityQueue.prototype._decrease = function(index) {
  	  var arr = this._arr;
  	  var priority = arr[index].priority;
  	  var parent;
  	  while (index !== 0) {
  	    parent = index >> 1;
  	    if (arr[parent].priority < priority) {
  	      break;
  	    }
  	    this._swap(index, parent);
  	    index = parent;
  	  }
  	};

  	PriorityQueue.prototype._swap = function(i, j) {
  	  var arr = this._arr;
  	  var keyIndices = this._keyIndices;
  	  var origArrI = arr[i];
  	  var origArrJ = arr[j];
  	  arr[i] = origArrJ;
  	  arr[j] = origArrI;
  	  keyIndices[origArrJ.key] = i;
  	  keyIndices[origArrI.key] = j;
  	};
  	return priorityQueue;
  }

  var dijkstra_1;
  var hasRequiredDijkstra;

  function requireDijkstra () {
  	if (hasRequiredDijkstra) return dijkstra_1;
  	hasRequiredDijkstra = 1;
  	var _ = requireLodash$1();
  	var PriorityQueue = requirePriorityQueue();

  	dijkstra_1 = dijkstra;

  	var DEFAULT_WEIGHT_FUNC = _.constant(1);

  	function dijkstra(g, source, weightFn, edgeFn) {
  	  return runDijkstra(g, String(source),
  	    weightFn || DEFAULT_WEIGHT_FUNC,
  	    edgeFn || function(v) { return g.outEdges(v); });
  	}

  	function runDijkstra(g, source, weightFn, edgeFn) {
  	  var results = {};
  	  var pq = new PriorityQueue();
  	  var v, vEntry;

  	  var updateNeighbors = function(edge) {
  	    var w = edge.v !== v ? edge.v : edge.w;
  	    var wEntry = results[w];
  	    var weight = weightFn(edge);
  	    var distance = vEntry.distance + weight;

  	    if (weight < 0) {
  	      throw new Error("dijkstra does not allow negative edge weights. " +
  	                      "Bad edge: " + edge + " Weight: " + weight);
  	    }

  	    if (distance < wEntry.distance) {
  	      wEntry.distance = distance;
  	      wEntry.predecessor = v;
  	      pq.decrease(w, distance);
  	    }
  	  };

  	  g.nodes().forEach(function(v) {
  	    var distance = v === source ? 0 : Number.POSITIVE_INFINITY;
  	    results[v] = { distance: distance };
  	    pq.add(v, distance);
  	  });

  	  while (pq.size() > 0) {
  	    v = pq.removeMin();
  	    vEntry = results[v];
  	    if (vEntry.distance === Number.POSITIVE_INFINITY) {
  	      break;
  	    }

  	    edgeFn(v).forEach(updateNeighbors);
  	  }

  	  return results;
  	}
  	return dijkstra_1;
  }

  var dijkstraAll_1;
  var hasRequiredDijkstraAll;

  function requireDijkstraAll () {
  	if (hasRequiredDijkstraAll) return dijkstraAll_1;
  	hasRequiredDijkstraAll = 1;
  	var dijkstra = requireDijkstra();
  	var _ = requireLodash$1();

  	dijkstraAll_1 = dijkstraAll;

  	function dijkstraAll(g, weightFunc, edgeFunc) {
  	  return _.transform(g.nodes(), function(acc, v) {
  	    acc[v] = dijkstra(g, v, weightFunc, edgeFunc);
  	  }, {});
  	}
  	return dijkstraAll_1;
  }

  var tarjan_1;
  var hasRequiredTarjan;

  function requireTarjan () {
  	if (hasRequiredTarjan) return tarjan_1;
  	hasRequiredTarjan = 1;
  	var _ = requireLodash$1();

  	tarjan_1 = tarjan;

  	function tarjan(g) {
  	  var index = 0;
  	  var stack = [];
  	  var visited = {}; // node id -> { onStack, lowlink, index }
  	  var results = [];

  	  function dfs(v) {
  	    var entry = visited[v] = {
  	      onStack: true,
  	      lowlink: index,
  	      index: index++
  	    };
  	    stack.push(v);

  	    g.successors(v).forEach(function(w) {
  	      if (!_.has(visited, w)) {
  	        dfs(w);
  	        entry.lowlink = Math.min(entry.lowlink, visited[w].lowlink);
  	      } else if (visited[w].onStack) {
  	        entry.lowlink = Math.min(entry.lowlink, visited[w].index);
  	      }
  	    });

  	    if (entry.lowlink === entry.index) {
  	      var cmpt = [];
  	      var w;
  	      do {
  	        w = stack.pop();
  	        visited[w].onStack = false;
  	        cmpt.push(w);
  	      } while (v !== w);
  	      results.push(cmpt);
  	    }
  	  }

  	  g.nodes().forEach(function(v) {
  	    if (!_.has(visited, v)) {
  	      dfs(v);
  	    }
  	  });

  	  return results;
  	}
  	return tarjan_1;
  }

  var findCycles_1;
  var hasRequiredFindCycles;

  function requireFindCycles () {
  	if (hasRequiredFindCycles) return findCycles_1;
  	hasRequiredFindCycles = 1;
  	var _ = requireLodash$1();
  	var tarjan = requireTarjan();

  	findCycles_1 = findCycles;

  	function findCycles(g) {
  	  return _.filter(tarjan(g), function(cmpt) {
  	    return cmpt.length > 1 || (cmpt.length === 1 && g.hasEdge(cmpt[0], cmpt[0]));
  	  });
  	}
  	return findCycles_1;
  }

  var floydWarshall_1;
  var hasRequiredFloydWarshall;

  function requireFloydWarshall () {
  	if (hasRequiredFloydWarshall) return floydWarshall_1;
  	hasRequiredFloydWarshall = 1;
  	var _ = requireLodash$1();

  	floydWarshall_1 = floydWarshall;

  	var DEFAULT_WEIGHT_FUNC = _.constant(1);

  	function floydWarshall(g, weightFn, edgeFn) {
  	  return runFloydWarshall(g,
  	    weightFn || DEFAULT_WEIGHT_FUNC,
  	    edgeFn || function(v) { return g.outEdges(v); });
  	}

  	function runFloydWarshall(g, weightFn, edgeFn) {
  	  var results = {};
  	  var nodes = g.nodes();

  	  nodes.forEach(function(v) {
  	    results[v] = {};
  	    results[v][v] = { distance: 0 };
  	    nodes.forEach(function(w) {
  	      if (v !== w) {
  	        results[v][w] = { distance: Number.POSITIVE_INFINITY };
  	      }
  	    });
  	    edgeFn(v).forEach(function(edge) {
  	      var w = edge.v === v ? edge.w : edge.v;
  	      var d = weightFn(edge);
  	      results[v][w] = { distance: d, predecessor: v };
  	    });
  	  });

  	  nodes.forEach(function(k) {
  	    var rowK = results[k];
  	    nodes.forEach(function(i) {
  	      var rowI = results[i];
  	      nodes.forEach(function(j) {
  	        var ik = rowI[k];
  	        var kj = rowK[j];
  	        var ij = rowI[j];
  	        var altDistance = ik.distance + kj.distance;
  	        if (altDistance < ij.distance) {
  	          ij.distance = altDistance;
  	          ij.predecessor = kj.predecessor;
  	        }
  	      });
  	    });
  	  });

  	  return results;
  	}
  	return floydWarshall_1;
  }

  var topsort_1;
  var hasRequiredTopsort;

  function requireTopsort () {
  	if (hasRequiredTopsort) return topsort_1;
  	hasRequiredTopsort = 1;
  	var _ = requireLodash$1();

  	topsort_1 = topsort;
  	topsort.CycleException = CycleException;

  	function topsort(g) {
  	  var visited = {};
  	  var stack = {};
  	  var results = [];

  	  function visit(node) {
  	    if (_.has(stack, node)) {
  	      throw new CycleException();
  	    }

  	    if (!_.has(visited, node)) {
  	      stack[node] = true;
  	      visited[node] = true;
  	      _.each(g.predecessors(node), visit);
  	      delete stack[node];
  	      results.push(node);
  	    }
  	  }

  	  _.each(g.sinks(), visit);

  	  if (_.size(visited) !== g.nodeCount()) {
  	    throw new CycleException();
  	  }

  	  return results;
  	}

  	function CycleException() {}
  	CycleException.prototype = new Error(); // must be an instance of Error to pass testing
  	return topsort_1;
  }

  var isAcyclic_1;
  var hasRequiredIsAcyclic;

  function requireIsAcyclic () {
  	if (hasRequiredIsAcyclic) return isAcyclic_1;
  	hasRequiredIsAcyclic = 1;
  	var topsort = requireTopsort();

  	isAcyclic_1 = isAcyclic;

  	function isAcyclic(g) {
  	  try {
  	    topsort(g);
  	  } catch (e) {
  	    if (e instanceof topsort.CycleException) {
  	      return false;
  	    }
  	    throw e;
  	  }
  	  return true;
  	}
  	return isAcyclic_1;
  }

  var dfs_1;
  var hasRequiredDfs;

  function requireDfs () {
  	if (hasRequiredDfs) return dfs_1;
  	hasRequiredDfs = 1;
  	var _ = requireLodash$1();

  	dfs_1 = dfs;

  	/*
  	 * A helper that preforms a pre- or post-order traversal on the input graph
  	 * and returns the nodes in the order they were visited. If the graph is
  	 * undirected then this algorithm will navigate using neighbors. If the graph
  	 * is directed then this algorithm will navigate using successors.
  	 *
  	 * Order must be one of "pre" or "post".
  	 */
  	function dfs(g, vs, order) {
  	  if (!_.isArray(vs)) {
  	    vs = [vs];
  	  }

  	  var navigation = (g.isDirected() ? g.successors : g.neighbors).bind(g);

  	  var acc = [];
  	  var visited = {};
  	  _.each(vs, function(v) {
  	    if (!g.hasNode(v)) {
  	      throw new Error("Graph does not have node: " + v);
  	    }

  	    doDfs(g, v, order === "post", visited, navigation, acc);
  	  });
  	  return acc;
  	}

  	function doDfs(g, v, postorder, visited, navigation, acc) {
  	  if (!_.has(visited, v)) {
  	    visited[v] = true;

  	    if (!postorder) { acc.push(v); }
  	    _.each(navigation(v), function(w) {
  	      doDfs(g, w, postorder, visited, navigation, acc);
  	    });
  	    if (postorder) { acc.push(v); }
  	  }
  	}
  	return dfs_1;
  }

  var postorder_1;
  var hasRequiredPostorder;

  function requirePostorder () {
  	if (hasRequiredPostorder) return postorder_1;
  	hasRequiredPostorder = 1;
  	var dfs = requireDfs();

  	postorder_1 = postorder;

  	function postorder(g, vs) {
  	  return dfs(g, vs, "post");
  	}
  	return postorder_1;
  }

  var preorder_1;
  var hasRequiredPreorder;

  function requirePreorder () {
  	if (hasRequiredPreorder) return preorder_1;
  	hasRequiredPreorder = 1;
  	var dfs = requireDfs();

  	preorder_1 = preorder;

  	function preorder(g, vs) {
  	  return dfs(g, vs, "pre");
  	}
  	return preorder_1;
  }

  var prim_1;
  var hasRequiredPrim;

  function requirePrim () {
  	if (hasRequiredPrim) return prim_1;
  	hasRequiredPrim = 1;
  	var _ = requireLodash$1();
  	var Graph = requireGraph();
  	var PriorityQueue = requirePriorityQueue();

  	prim_1 = prim;

  	function prim(g, weightFunc) {
  	  var result = new Graph();
  	  var parents = {};
  	  var pq = new PriorityQueue();
  	  var v;

  	  function updateNeighbors(edge) {
  	    var w = edge.v === v ? edge.w : edge.v;
  	    var pri = pq.priority(w);
  	    if (pri !== undefined) {
  	      var edgeWeight = weightFunc(edge);
  	      if (edgeWeight < pri) {
  	        parents[w] = v;
  	        pq.decrease(w, edgeWeight);
  	      }
  	    }
  	  }

  	  if (g.nodeCount() === 0) {
  	    return result;
  	  }

  	  _.each(g.nodes(), function(v) {
  	    pq.add(v, Number.POSITIVE_INFINITY);
  	    result.setNode(v);
  	  });

  	  // Start from an arbitrary node
  	  pq.decrease(g.nodes()[0], 0);

  	  var init = false;
  	  while (pq.size() > 0) {
  	    v = pq.removeMin();
  	    if (_.has(parents, v)) {
  	      result.setEdge(v, parents[v]);
  	    } else if (init) {
  	      throw new Error("Input graph is not connected: " + g);
  	    } else {
  	      init = true;
  	    }

  	    g.nodeEdges(v).forEach(updateNeighbors);
  	  }

  	  return result;
  	}
  	return prim_1;
  }

  var alg;
  var hasRequiredAlg;

  function requireAlg () {
  	if (hasRequiredAlg) return alg;
  	hasRequiredAlg = 1;
  	alg = {
  	  components: requireComponents(),
  	  dijkstra: requireDijkstra(),
  	  dijkstraAll: requireDijkstraAll(),
  	  findCycles: requireFindCycles(),
  	  floydWarshall: requireFloydWarshall(),
  	  isAcyclic: requireIsAcyclic(),
  	  postorder: requirePostorder(),
  	  preorder: requirePreorder(),
  	  prim: requirePrim(),
  	  tarjan: requireTarjan(),
  	  topsort: requireTopsort()
  	};
  	return alg;
  }

  /**
   * Copyright (c) 2014, Chris Pettitt
   * All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice, this
   * list of conditions and the following disclaimer.
   *
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   * this list of conditions and the following disclaimer in the documentation
   * and/or other materials provided with the distribution.
   *
   * 3. Neither the name of the copyright holder nor the names of its contributors
   * may be used to endorse or promote products derived from this software without
   * specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
   * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
   * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
   * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
   * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
   * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
   * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */

  var graphlib;
  var hasRequiredGraphlib$1;

  function requireGraphlib$1 () {
  	if (hasRequiredGraphlib$1) return graphlib;
  	hasRequiredGraphlib$1 = 1;
  	var lib = requireLib();

  	graphlib = {
  	  Graph: lib.Graph,
  	  json: requireJson(),
  	  alg: requireAlg(),
  	  version: lib.version
  	};
  	return graphlib;
  }

  /* global window */

  var graphlib_1;
  var hasRequiredGraphlib;

  function requireGraphlib () {
  	if (hasRequiredGraphlib) return graphlib_1;
  	hasRequiredGraphlib = 1;
  	var graphlib;

  	if (typeof commonjsRequire === "function") {
  	  try {
  	    graphlib = requireGraphlib$1();
  	  } catch (e) {
  	    // continue regardless of error
  	  }
  	}

  	if (!graphlib) {
  	  graphlib = window.graphlib;
  	}

  	graphlib_1 = graphlib;
  	return graphlib_1;
  }

  var cloneDeep_1;
  var hasRequiredCloneDeep;

  function requireCloneDeep () {
  	if (hasRequiredCloneDeep) return cloneDeep_1;
  	hasRequiredCloneDeep = 1;
  	var baseClone = require_baseClone();

  	/** Used to compose bitmasks for cloning. */
  	var CLONE_DEEP_FLAG = 1,
  	    CLONE_SYMBOLS_FLAG = 4;

  	/**
  	 * This method is like `_.clone` except that it recursively clones `value`.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 1.0.0
  	 * @category Lang
  	 * @param {*} value The value to recursively clone.
  	 * @returns {*} Returns the deep cloned value.
  	 * @see _.clone
  	 * @example
  	 *
  	 * var objects = [{ 'a': 1 }, { 'b': 2 }];
  	 *
  	 * var deep = _.cloneDeep(objects);
  	 * console.log(deep[0] === objects[0]);
  	 * // => false
  	 */
  	function cloneDeep(value) {
  	  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
  	}

  	cloneDeep_1 = cloneDeep;
  	return cloneDeep_1;
  }

  var _isIterateeCall;
  var hasRequired_isIterateeCall;

  function require_isIterateeCall () {
  	if (hasRequired_isIterateeCall) return _isIterateeCall;
  	hasRequired_isIterateeCall = 1;
  	var eq = requireEq(),
  	    isArrayLike = requireIsArrayLike(),
  	    isIndex = require_isIndex(),
  	    isObject = requireIsObject();

  	/**
  	 * Checks if the given arguments are from an iteratee call.
  	 *
  	 * @private
  	 * @param {*} value The potential iteratee value argument.
  	 * @param {*} index The potential iteratee index or key argument.
  	 * @param {*} object The potential iteratee object argument.
  	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
  	 *  else `false`.
  	 */
  	function isIterateeCall(value, index, object) {
  	  if (!isObject(object)) {
  	    return false;
  	  }
  	  var type = typeof index;
  	  if (type == 'number'
  	        ? (isArrayLike(object) && isIndex(index, object.length))
  	        : (type == 'string' && index in object)
  	      ) {
  	    return eq(object[index], value);
  	  }
  	  return false;
  	}

  	_isIterateeCall = isIterateeCall;
  	return _isIterateeCall;
  }

  var defaults_1;
  var hasRequiredDefaults;

  function requireDefaults () {
  	if (hasRequiredDefaults) return defaults_1;
  	hasRequiredDefaults = 1;
  	var baseRest = require_baseRest(),
  	    eq = requireEq(),
  	    isIterateeCall = require_isIterateeCall(),
  	    keysIn = requireKeysIn();

  	/** Used for built-in method references. */
  	var objectProto = Object.prototype;

  	/** Used to check objects for own properties. */
  	var hasOwnProperty = objectProto.hasOwnProperty;

  	/**
  	 * Assigns own and inherited enumerable string keyed properties of source
  	 * objects to the destination object for all destination properties that
  	 * resolve to `undefined`. Source objects are applied from left to right.
  	 * Once a property is set, additional values of the same property are ignored.
  	 *
  	 * **Note:** This method mutates `object`.
  	 *
  	 * @static
  	 * @since 0.1.0
  	 * @memberOf _
  	 * @category Object
  	 * @param {Object} object The destination object.
  	 * @param {...Object} [sources] The source objects.
  	 * @returns {Object} Returns `object`.
  	 * @see _.defaultsDeep
  	 * @example
  	 *
  	 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
  	 * // => { 'a': 1, 'b': 2 }
  	 */
  	var defaults = baseRest(function(object, sources) {
  	  object = Object(object);

  	  var index = -1;
  	  var length = sources.length;
  	  var guard = length > 2 ? sources[2] : undefined;

  	  if (guard && isIterateeCall(sources[0], sources[1], guard)) {
  	    length = 1;
  	  }

  	  while (++index < length) {
  	    var source = sources[index];
  	    var props = keysIn(source);
  	    var propsIndex = -1;
  	    var propsLength = props.length;

  	    while (++propsIndex < propsLength) {
  	      var key = props[propsIndex];
  	      var value = object[key];

  	      if (value === undefined ||
  	          (eq(value, objectProto[key]) && !hasOwnProperty.call(object, key))) {
  	        object[key] = source[key];
  	      }
  	    }
  	  }

  	  return object;
  	});

  	defaults_1 = defaults;
  	return defaults_1;
  }

  var _createFind;
  var hasRequired_createFind;

  function require_createFind () {
  	if (hasRequired_createFind) return _createFind;
  	hasRequired_createFind = 1;
  	var baseIteratee = require_baseIteratee(),
  	    isArrayLike = requireIsArrayLike(),
  	    keys = requireKeys();

  	/**
  	 * Creates a `_.find` or `_.findLast` function.
  	 *
  	 * @private
  	 * @param {Function} findIndexFunc The function to find the collection index.
  	 * @returns {Function} Returns the new find function.
  	 */
  	function createFind(findIndexFunc) {
  	  return function(collection, predicate, fromIndex) {
  	    var iterable = Object(collection);
  	    if (!isArrayLike(collection)) {
  	      var iteratee = baseIteratee(predicate, 3);
  	      collection = keys(collection);
  	      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
  	    }
  	    var index = findIndexFunc(collection, predicate, fromIndex);
  	    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  	  };
  	}

  	_createFind = createFind;
  	return _createFind;
  }

  /** Used to match a single whitespace character. */

  var _trimmedEndIndex;
  var hasRequired_trimmedEndIndex;

  function require_trimmedEndIndex () {
  	if (hasRequired_trimmedEndIndex) return _trimmedEndIndex;
  	hasRequired_trimmedEndIndex = 1;
  	var reWhitespace = /\s/;

  	/**
  	 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
  	 * character of `string`.
  	 *
  	 * @private
  	 * @param {string} string The string to inspect.
  	 * @returns {number} Returns the index of the last non-whitespace character.
  	 */
  	function trimmedEndIndex(string) {
  	  var index = string.length;

  	  while (index-- && reWhitespace.test(string.charAt(index))) {}
  	  return index;
  	}

  	_trimmedEndIndex = trimmedEndIndex;
  	return _trimmedEndIndex;
  }

  var _baseTrim;
  var hasRequired_baseTrim;

  function require_baseTrim () {
  	if (hasRequired_baseTrim) return _baseTrim;
  	hasRequired_baseTrim = 1;
  	var trimmedEndIndex = require_trimmedEndIndex();

  	/** Used to match leading whitespace. */
  	var reTrimStart = /^\s+/;

  	/**
  	 * The base implementation of `_.trim`.
  	 *
  	 * @private
  	 * @param {string} string The string to trim.
  	 * @returns {string} Returns the trimmed string.
  	 */
  	function baseTrim(string) {
  	  return string
  	    ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
  	    : string;
  	}

  	_baseTrim = baseTrim;
  	return _baseTrim;
  }

  var toNumber_1;
  var hasRequiredToNumber;

  function requireToNumber () {
  	if (hasRequiredToNumber) return toNumber_1;
  	hasRequiredToNumber = 1;
  	var baseTrim = require_baseTrim(),
  	    isObject = requireIsObject(),
  	    isSymbol = requireIsSymbol();

  	/** Used as references for various `Number` constants. */
  	var NAN = 0 / 0;

  	/** Used to detect bad signed hexadecimal string values. */
  	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  	/** Used to detect binary string values. */
  	var reIsBinary = /^0b[01]+$/i;

  	/** Used to detect octal string values. */
  	var reIsOctal = /^0o[0-7]+$/i;

  	/** Built-in method references without a dependency on `root`. */
  	var freeParseInt = parseInt;

  	/**
  	 * Converts `value` to a number.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 4.0.0
  	 * @category Lang
  	 * @param {*} value The value to process.
  	 * @returns {number} Returns the number.
  	 * @example
  	 *
  	 * _.toNumber(3.2);
  	 * // => 3.2
  	 *
  	 * _.toNumber(Number.MIN_VALUE);
  	 * // => 5e-324
  	 *
  	 * _.toNumber(Infinity);
  	 * // => Infinity
  	 *
  	 * _.toNumber('3.2');
  	 * // => 3.2
  	 */
  	function toNumber(value) {
  	  if (typeof value == 'number') {
  	    return value;
  	  }
  	  if (isSymbol(value)) {
  	    return NAN;
  	  }
  	  if (isObject(value)) {
  	    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
  	    value = isObject(other) ? (other + '') : other;
  	  }
  	  if (typeof value != 'string') {
  	    return value === 0 ? value : +value;
  	  }
  	  value = baseTrim(value);
  	  var isBinary = reIsBinary.test(value);
  	  return (isBinary || reIsOctal.test(value))
  	    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
  	    : (reIsBadHex.test(value) ? NAN : +value);
  	}

  	toNumber_1 = toNumber;
  	return toNumber_1;
  }

  var toFinite_1;
  var hasRequiredToFinite;

  function requireToFinite () {
  	if (hasRequiredToFinite) return toFinite_1;
  	hasRequiredToFinite = 1;
  	var toNumber = requireToNumber();

  	/** Used as references for various `Number` constants. */
  	var INFINITY = 1 / 0,
  	    MAX_INTEGER = 1.7976931348623157e+308;

  	/**
  	 * Converts `value` to a finite number.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 4.12.0
  	 * @category Lang
  	 * @param {*} value The value to convert.
  	 * @returns {number} Returns the converted number.
  	 * @example
  	 *
  	 * _.toFinite(3.2);
  	 * // => 3.2
  	 *
  	 * _.toFinite(Number.MIN_VALUE);
  	 * // => 5e-324
  	 *
  	 * _.toFinite(Infinity);
  	 * // => 1.7976931348623157e+308
  	 *
  	 * _.toFinite('3.2');
  	 * // => 3.2
  	 */
  	function toFinite(value) {
  	  if (!value) {
  	    return value === 0 ? value : 0;
  	  }
  	  value = toNumber(value);
  	  if (value === INFINITY || value === -INFINITY) {
  	    var sign = (value < 0 ? -1 : 1);
  	    return sign * MAX_INTEGER;
  	  }
  	  return value === value ? value : 0;
  	}

  	toFinite_1 = toFinite;
  	return toFinite_1;
  }

  var toInteger_1;
  var hasRequiredToInteger;

  function requireToInteger () {
  	if (hasRequiredToInteger) return toInteger_1;
  	hasRequiredToInteger = 1;
  	var toFinite = requireToFinite();

  	/**
  	 * Converts `value` to an integer.
  	 *
  	 * **Note:** This method is loosely based on
  	 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 4.0.0
  	 * @category Lang
  	 * @param {*} value The value to convert.
  	 * @returns {number} Returns the converted integer.
  	 * @example
  	 *
  	 * _.toInteger(3.2);
  	 * // => 3
  	 *
  	 * _.toInteger(Number.MIN_VALUE);
  	 * // => 0
  	 *
  	 * _.toInteger(Infinity);
  	 * // => 1.7976931348623157e+308
  	 *
  	 * _.toInteger('3.2');
  	 * // => 3
  	 */
  	function toInteger(value) {
  	  var result = toFinite(value),
  	      remainder = result % 1;

  	  return result === result ? (remainder ? result - remainder : result) : 0;
  	}

  	toInteger_1 = toInteger;
  	return toInteger_1;
  }

  var findIndex_1;
  var hasRequiredFindIndex;

  function requireFindIndex () {
  	if (hasRequiredFindIndex) return findIndex_1;
  	hasRequiredFindIndex = 1;
  	var baseFindIndex = require_baseFindIndex(),
  	    baseIteratee = require_baseIteratee(),
  	    toInteger = requireToInteger();

  	/* Built-in method references for those with the same name as other `lodash` methods. */
  	var nativeMax = Math.max;

  	/**
  	 * This method is like `_.find` except that it returns the index of the first
  	 * element `predicate` returns truthy for instead of the element itself.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 1.1.0
  	 * @category Array
  	 * @param {Array} array The array to inspect.
  	 * @param {Function} [predicate=_.identity] The function invoked per iteration.
  	 * @param {number} [fromIndex=0] The index to search from.
  	 * @returns {number} Returns the index of the found element, else `-1`.
  	 * @example
  	 *
  	 * var users = [
  	 *   { 'user': 'barney',  'active': false },
  	 *   { 'user': 'fred',    'active': false },
  	 *   { 'user': 'pebbles', 'active': true }
  	 * ];
  	 *
  	 * _.findIndex(users, function(o) { return o.user == 'barney'; });
  	 * // => 0
  	 *
  	 * // The `_.matches` iteratee shorthand.
  	 * _.findIndex(users, { 'user': 'fred', 'active': false });
  	 * // => 1
  	 *
  	 * // The `_.matchesProperty` iteratee shorthand.
  	 * _.findIndex(users, ['active', false]);
  	 * // => 0
  	 *
  	 * // The `_.property` iteratee shorthand.
  	 * _.findIndex(users, 'active');
  	 * // => 2
  	 */
  	function findIndex(array, predicate, fromIndex) {
  	  var length = array == null ? 0 : array.length;
  	  if (!length) {
  	    return -1;
  	  }
  	  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  	  if (index < 0) {
  	    index = nativeMax(length + index, 0);
  	  }
  	  return baseFindIndex(array, baseIteratee(predicate, 3), index);
  	}

  	findIndex_1 = findIndex;
  	return findIndex_1;
  }

  var find_1;
  var hasRequiredFind;

  function requireFind () {
  	if (hasRequiredFind) return find_1;
  	hasRequiredFind = 1;
  	var createFind = require_createFind(),
  	    findIndex = requireFindIndex();

  	/**
  	 * Iterates over elements of `collection`, returning the first element
  	 * `predicate` returns truthy for. The predicate is invoked with three
  	 * arguments: (value, index|key, collection).
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 0.1.0
  	 * @category Collection
  	 * @param {Array|Object} collection The collection to inspect.
  	 * @param {Function} [predicate=_.identity] The function invoked per iteration.
  	 * @param {number} [fromIndex=0] The index to search from.
  	 * @returns {*} Returns the matched element, else `undefined`.
  	 * @example
  	 *
  	 * var users = [
  	 *   { 'user': 'barney',  'age': 36, 'active': true },
  	 *   { 'user': 'fred',    'age': 40, 'active': false },
  	 *   { 'user': 'pebbles', 'age': 1,  'active': true }
  	 * ];
  	 *
  	 * _.find(users, function(o) { return o.age < 40; });
  	 * // => object for 'barney'
  	 *
  	 * // The `_.matches` iteratee shorthand.
  	 * _.find(users, { 'age': 1, 'active': true });
  	 * // => object for 'pebbles'
  	 *
  	 * // The `_.matchesProperty` iteratee shorthand.
  	 * _.find(users, ['active', false]);
  	 * // => object for 'fred'
  	 *
  	 * // The `_.property` iteratee shorthand.
  	 * _.find(users, 'active');
  	 * // => object for 'barney'
  	 */
  	var find = createFind(findIndex);

  	find_1 = find;
  	return find_1;
  }

  var flatten_1;
  var hasRequiredFlatten;

  function requireFlatten () {
  	if (hasRequiredFlatten) return flatten_1;
  	hasRequiredFlatten = 1;
  	var baseFlatten = require_baseFlatten();

  	/**
  	 * Flattens `array` a single level deep.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 0.1.0
  	 * @category Array
  	 * @param {Array} array The array to flatten.
  	 * @returns {Array} Returns the new flattened array.
  	 * @example
  	 *
  	 * _.flatten([1, [2, [3, [4]], 5]]);
  	 * // => [1, 2, [3, [4]], 5]
  	 */
  	function flatten(array) {
  	  var length = array == null ? 0 : array.length;
  	  return length ? baseFlatten(array, 1) : [];
  	}

  	flatten_1 = flatten;
  	return flatten_1;
  }

  var forIn_1;
  var hasRequiredForIn;

  function requireForIn () {
  	if (hasRequiredForIn) return forIn_1;
  	hasRequiredForIn = 1;
  	var baseFor = require_baseFor(),
  	    castFunction = require_castFunction(),
  	    keysIn = requireKeysIn();

  	/**
  	 * Iterates over own and inherited enumerable string keyed properties of an
  	 * object and invokes `iteratee` for each property. The iteratee is invoked
  	 * with three arguments: (value, key, object). Iteratee functions may exit
  	 * iteration early by explicitly returning `false`.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 0.3.0
  	 * @category Object
  	 * @param {Object} object The object to iterate over.
  	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
  	 * @returns {Object} Returns `object`.
  	 * @see _.forInRight
  	 * @example
  	 *
  	 * function Foo() {
  	 *   this.a = 1;
  	 *   this.b = 2;
  	 * }
  	 *
  	 * Foo.prototype.c = 3;
  	 *
  	 * _.forIn(new Foo, function(value, key) {
  	 *   console.log(key);
  	 * });
  	 * // => Logs 'a', 'b', then 'c' (iteration order is not guaranteed).
  	 */
  	function forIn(object, iteratee) {
  	  return object == null
  	    ? object
  	    : baseFor(object, castFunction(iteratee), keysIn);
  	}

  	forIn_1 = forIn;
  	return forIn_1;
  }

  /**
   * Gets the last element of `array`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {Array} array The array to query.
   * @returns {*} Returns the last element of `array`.
   * @example
   *
   * _.last([1, 2, 3]);
   * // => 3
   */

  var last_1;
  var hasRequiredLast;

  function requireLast () {
  	if (hasRequiredLast) return last_1;
  	hasRequiredLast = 1;
  	function last(array) {
  	  var length = array == null ? 0 : array.length;
  	  return length ? array[length - 1] : undefined;
  	}

  	last_1 = last;
  	return last_1;
  }

  var mapValues_1;
  var hasRequiredMapValues;

  function requireMapValues () {
  	if (hasRequiredMapValues) return mapValues_1;
  	hasRequiredMapValues = 1;
  	var baseAssignValue = require_baseAssignValue(),
  	    baseForOwn = require_baseForOwn(),
  	    baseIteratee = require_baseIteratee();

  	/**
  	 * Creates an object with the same keys as `object` and values generated
  	 * by running each own enumerable string keyed property of `object` thru
  	 * `iteratee`. The iteratee is invoked with three arguments:
  	 * (value, key, object).
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 2.4.0
  	 * @category Object
  	 * @param {Object} object The object to iterate over.
  	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
  	 * @returns {Object} Returns the new mapped object.
  	 * @see _.mapKeys
  	 * @example
  	 *
  	 * var users = {
  	 *   'fred':    { 'user': 'fred',    'age': 40 },
  	 *   'pebbles': { 'user': 'pebbles', 'age': 1 }
  	 * };
  	 *
  	 * _.mapValues(users, function(o) { return o.age; });
  	 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
  	 *
  	 * // The `_.property` iteratee shorthand.
  	 * _.mapValues(users, 'age');
  	 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
  	 */
  	function mapValues(object, iteratee) {
  	  var result = {};
  	  iteratee = baseIteratee(iteratee, 3);

  	  baseForOwn(object, function(value, key, object) {
  	    baseAssignValue(result, key, iteratee(value, key, object));
  	  });
  	  return result;
  	}

  	mapValues_1 = mapValues;
  	return mapValues_1;
  }

  var _baseExtremum;
  var hasRequired_baseExtremum;

  function require_baseExtremum () {
  	if (hasRequired_baseExtremum) return _baseExtremum;
  	hasRequired_baseExtremum = 1;
  	var isSymbol = requireIsSymbol();

  	/**
  	 * The base implementation of methods like `_.max` and `_.min` which accepts a
  	 * `comparator` to determine the extremum value.
  	 *
  	 * @private
  	 * @param {Array} array The array to iterate over.
  	 * @param {Function} iteratee The iteratee invoked per iteration.
  	 * @param {Function} comparator The comparator used to compare values.
  	 * @returns {*} Returns the extremum value.
  	 */
  	function baseExtremum(array, iteratee, comparator) {
  	  var index = -1,
  	      length = array.length;

  	  while (++index < length) {
  	    var value = array[index],
  	        current = iteratee(value);

  	    if (current != null && (computed === undefined
  	          ? (current === current && !isSymbol(current))
  	          : comparator(current, computed)
  	        )) {
  	      var computed = current,
  	          result = value;
  	    }
  	  }
  	  return result;
  	}

  	_baseExtremum = baseExtremum;
  	return _baseExtremum;
  }

  /**
   * The base implementation of `_.gt` which doesn't coerce arguments.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if `value` is greater than `other`,
   *  else `false`.
   */

  var _baseGt;
  var hasRequired_baseGt;

  function require_baseGt () {
  	if (hasRequired_baseGt) return _baseGt;
  	hasRequired_baseGt = 1;
  	function baseGt(value, other) {
  	  return value > other;
  	}

  	_baseGt = baseGt;
  	return _baseGt;
  }

  var max_1;
  var hasRequiredMax;

  function requireMax () {
  	if (hasRequiredMax) return max_1;
  	hasRequiredMax = 1;
  	var baseExtremum = require_baseExtremum(),
  	    baseGt = require_baseGt(),
  	    identity = requireIdentity();

  	/**
  	 * Computes the maximum value of `array`. If `array` is empty or falsey,
  	 * `undefined` is returned.
  	 *
  	 * @static
  	 * @since 0.1.0
  	 * @memberOf _
  	 * @category Math
  	 * @param {Array} array The array to iterate over.
  	 * @returns {*} Returns the maximum value.
  	 * @example
  	 *
  	 * _.max([4, 2, 8, 6]);
  	 * // => 8
  	 *
  	 * _.max([]);
  	 * // => undefined
  	 */
  	function max(array) {
  	  return (array && array.length)
  	    ? baseExtremum(array, identity, baseGt)
  	    : undefined;
  	}

  	max_1 = max;
  	return max_1;
  }

  var _assignMergeValue;
  var hasRequired_assignMergeValue;

  function require_assignMergeValue () {
  	if (hasRequired_assignMergeValue) return _assignMergeValue;
  	hasRequired_assignMergeValue = 1;
  	var baseAssignValue = require_baseAssignValue(),
  	    eq = requireEq();

  	/**
  	 * This function is like `assignValue` except that it doesn't assign
  	 * `undefined` values.
  	 *
  	 * @private
  	 * @param {Object} object The object to modify.
  	 * @param {string} key The key of the property to assign.
  	 * @param {*} value The value to assign.
  	 */
  	function assignMergeValue(object, key, value) {
  	  if ((value !== undefined && !eq(object[key], value)) ||
  	      (value === undefined && !(key in object))) {
  	    baseAssignValue(object, key, value);
  	  }
  	}

  	_assignMergeValue = assignMergeValue;
  	return _assignMergeValue;
  }

  var isPlainObject_1;
  var hasRequiredIsPlainObject;

  function requireIsPlainObject () {
  	if (hasRequiredIsPlainObject) return isPlainObject_1;
  	hasRequiredIsPlainObject = 1;
  	var baseGetTag = require_baseGetTag(),
  	    getPrototype = require_getPrototype(),
  	    isObjectLike = requireIsObjectLike();

  	/** `Object#toString` result references. */
  	var objectTag = '[object Object]';

  	/** Used for built-in method references. */
  	var funcProto = Function.prototype,
  	    objectProto = Object.prototype;

  	/** Used to resolve the decompiled source of functions. */
  	var funcToString = funcProto.toString;

  	/** Used to check objects for own properties. */
  	var hasOwnProperty = objectProto.hasOwnProperty;

  	/** Used to infer the `Object` constructor. */
  	var objectCtorString = funcToString.call(Object);

  	/**
  	 * Checks if `value` is a plain object, that is, an object created by the
  	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 0.8.0
  	 * @category Lang
  	 * @param {*} value The value to check.
  	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
  	 * @example
  	 *
  	 * function Foo() {
  	 *   this.a = 1;
  	 * }
  	 *
  	 * _.isPlainObject(new Foo);
  	 * // => false
  	 *
  	 * _.isPlainObject([1, 2, 3]);
  	 * // => false
  	 *
  	 * _.isPlainObject({ 'x': 0, 'y': 0 });
  	 * // => true
  	 *
  	 * _.isPlainObject(Object.create(null));
  	 * // => true
  	 */
  	function isPlainObject(value) {
  	  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
  	    return false;
  	  }
  	  var proto = getPrototype(value);
  	  if (proto === null) {
  	    return true;
  	  }
  	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  	  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
  	    funcToString.call(Ctor) == objectCtorString;
  	}

  	isPlainObject_1 = isPlainObject;
  	return isPlainObject_1;
  }

  /**
   * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */

  var _safeGet;
  var hasRequired_safeGet;

  function require_safeGet () {
  	if (hasRequired_safeGet) return _safeGet;
  	hasRequired_safeGet = 1;
  	function safeGet(object, key) {
  	  if (key === 'constructor' && typeof object[key] === 'function') {
  	    return;
  	  }

  	  if (key == '__proto__') {
  	    return;
  	  }

  	  return object[key];
  	}

  	_safeGet = safeGet;
  	return _safeGet;
  }

  var toPlainObject_1;
  var hasRequiredToPlainObject;

  function requireToPlainObject () {
  	if (hasRequiredToPlainObject) return toPlainObject_1;
  	hasRequiredToPlainObject = 1;
  	var copyObject = require_copyObject(),
  	    keysIn = requireKeysIn();

  	/**
  	 * Converts `value` to a plain object flattening inherited enumerable string
  	 * keyed properties of `value` to own properties of the plain object.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 3.0.0
  	 * @category Lang
  	 * @param {*} value The value to convert.
  	 * @returns {Object} Returns the converted plain object.
  	 * @example
  	 *
  	 * function Foo() {
  	 *   this.b = 2;
  	 * }
  	 *
  	 * Foo.prototype.c = 3;
  	 *
  	 * _.assign({ 'a': 1 }, new Foo);
  	 * // => { 'a': 1, 'b': 2 }
  	 *
  	 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
  	 * // => { 'a': 1, 'b': 2, 'c': 3 }
  	 */
  	function toPlainObject(value) {
  	  return copyObject(value, keysIn(value));
  	}

  	toPlainObject_1 = toPlainObject;
  	return toPlainObject_1;
  }

  var _baseMergeDeep;
  var hasRequired_baseMergeDeep;

  function require_baseMergeDeep () {
  	if (hasRequired_baseMergeDeep) return _baseMergeDeep;
  	hasRequired_baseMergeDeep = 1;
  	var assignMergeValue = require_assignMergeValue(),
  	    cloneBuffer = require_cloneBuffer(),
  	    cloneTypedArray = require_cloneTypedArray(),
  	    copyArray = require_copyArray(),
  	    initCloneObject = require_initCloneObject(),
  	    isArguments = requireIsArguments(),
  	    isArray = requireIsArray(),
  	    isArrayLikeObject = requireIsArrayLikeObject(),
  	    isBuffer = requireIsBuffer(),
  	    isFunction = requireIsFunction(),
  	    isObject = requireIsObject(),
  	    isPlainObject = requireIsPlainObject(),
  	    isTypedArray = requireIsTypedArray(),
  	    safeGet = require_safeGet(),
  	    toPlainObject = requireToPlainObject();

  	/**
  	 * A specialized version of `baseMerge` for arrays and objects which performs
  	 * deep merges and tracks traversed objects enabling objects with circular
  	 * references to be merged.
  	 *
  	 * @private
  	 * @param {Object} object The destination object.
  	 * @param {Object} source The source object.
  	 * @param {string} key The key of the value to merge.
  	 * @param {number} srcIndex The index of `source`.
  	 * @param {Function} mergeFunc The function to merge values.
  	 * @param {Function} [customizer] The function to customize assigned values.
  	 * @param {Object} [stack] Tracks traversed source values and their merged
  	 *  counterparts.
  	 */
  	function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  	  var objValue = safeGet(object, key),
  	      srcValue = safeGet(source, key),
  	      stacked = stack.get(srcValue);

  	  if (stacked) {
  	    assignMergeValue(object, key, stacked);
  	    return;
  	  }
  	  var newValue = customizer
  	    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
  	    : undefined;

  	  var isCommon = newValue === undefined;

  	  if (isCommon) {
  	    var isArr = isArray(srcValue),
  	        isBuff = !isArr && isBuffer(srcValue),
  	        isTyped = !isArr && !isBuff && isTypedArray(srcValue);

  	    newValue = srcValue;
  	    if (isArr || isBuff || isTyped) {
  	      if (isArray(objValue)) {
  	        newValue = objValue;
  	      }
  	      else if (isArrayLikeObject(objValue)) {
  	        newValue = copyArray(objValue);
  	      }
  	      else if (isBuff) {
  	        isCommon = false;
  	        newValue = cloneBuffer(srcValue, true);
  	      }
  	      else if (isTyped) {
  	        isCommon = false;
  	        newValue = cloneTypedArray(srcValue, true);
  	      }
  	      else {
  	        newValue = [];
  	      }
  	    }
  	    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
  	      newValue = objValue;
  	      if (isArguments(objValue)) {
  	        newValue = toPlainObject(objValue);
  	      }
  	      else if (!isObject(objValue) || isFunction(objValue)) {
  	        newValue = initCloneObject(srcValue);
  	      }
  	    }
  	    else {
  	      isCommon = false;
  	    }
  	  }
  	  if (isCommon) {
  	    // Recursively merge objects and arrays (susceptible to call stack limits).
  	    stack.set(srcValue, newValue);
  	    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
  	    stack['delete'](srcValue);
  	  }
  	  assignMergeValue(object, key, newValue);
  	}

  	_baseMergeDeep = baseMergeDeep;
  	return _baseMergeDeep;
  }

  var _baseMerge;
  var hasRequired_baseMerge;

  function require_baseMerge () {
  	if (hasRequired_baseMerge) return _baseMerge;
  	hasRequired_baseMerge = 1;
  	var Stack = require_Stack(),
  	    assignMergeValue = require_assignMergeValue(),
  	    baseFor = require_baseFor(),
  	    baseMergeDeep = require_baseMergeDeep(),
  	    isObject = requireIsObject(),
  	    keysIn = requireKeysIn(),
  	    safeGet = require_safeGet();

  	/**
  	 * The base implementation of `_.merge` without support for multiple sources.
  	 *
  	 * @private
  	 * @param {Object} object The destination object.
  	 * @param {Object} source The source object.
  	 * @param {number} srcIndex The index of `source`.
  	 * @param {Function} [customizer] The function to customize merged values.
  	 * @param {Object} [stack] Tracks traversed source values and their merged
  	 *  counterparts.
  	 */
  	function baseMerge(object, source, srcIndex, customizer, stack) {
  	  if (object === source) {
  	    return;
  	  }
  	  baseFor(source, function(srcValue, key) {
  	    stack || (stack = new Stack);
  	    if (isObject(srcValue)) {
  	      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
  	    }
  	    else {
  	      var newValue = customizer
  	        ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
  	        : undefined;

  	      if (newValue === undefined) {
  	        newValue = srcValue;
  	      }
  	      assignMergeValue(object, key, newValue);
  	    }
  	  }, keysIn);
  	}

  	_baseMerge = baseMerge;
  	return _baseMerge;
  }

  var _createAssigner;
  var hasRequired_createAssigner;

  function require_createAssigner () {
  	if (hasRequired_createAssigner) return _createAssigner;
  	hasRequired_createAssigner = 1;
  	var baseRest = require_baseRest(),
  	    isIterateeCall = require_isIterateeCall();

  	/**
  	 * Creates a function like `_.assign`.
  	 *
  	 * @private
  	 * @param {Function} assigner The function to assign values.
  	 * @returns {Function} Returns the new assigner function.
  	 */
  	function createAssigner(assigner) {
  	  return baseRest(function(object, sources) {
  	    var index = -1,
  	        length = sources.length,
  	        customizer = length > 1 ? sources[length - 1] : undefined,
  	        guard = length > 2 ? sources[2] : undefined;

  	    customizer = (assigner.length > 3 && typeof customizer == 'function')
  	      ? (length--, customizer)
  	      : undefined;

  	    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
  	      customizer = length < 3 ? undefined : customizer;
  	      length = 1;
  	    }
  	    object = Object(object);
  	    while (++index < length) {
  	      var source = sources[index];
  	      if (source) {
  	        assigner(object, source, index, customizer);
  	      }
  	    }
  	    return object;
  	  });
  	}

  	_createAssigner = createAssigner;
  	return _createAssigner;
  }

  var merge_1;
  var hasRequiredMerge;

  function requireMerge () {
  	if (hasRequiredMerge) return merge_1;
  	hasRequiredMerge = 1;
  	var baseMerge = require_baseMerge(),
  	    createAssigner = require_createAssigner();

  	/**
  	 * This method is like `_.assign` except that it recursively merges own and
  	 * inherited enumerable string keyed properties of source objects into the
  	 * destination object. Source properties that resolve to `undefined` are
  	 * skipped if a destination value exists. Array and plain object properties
  	 * are merged recursively. Other objects and value types are overridden by
  	 * assignment. Source objects are applied from left to right. Subsequent
  	 * sources overwrite property assignments of previous sources.
  	 *
  	 * **Note:** This method mutates `object`.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 0.5.0
  	 * @category Object
  	 * @param {Object} object The destination object.
  	 * @param {...Object} [sources] The source objects.
  	 * @returns {Object} Returns `object`.
  	 * @example
  	 *
  	 * var object = {
  	 *   'a': [{ 'b': 2 }, { 'd': 4 }]
  	 * };
  	 *
  	 * var other = {
  	 *   'a': [{ 'c': 3 }, { 'e': 5 }]
  	 * };
  	 *
  	 * _.merge(object, other);
  	 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
  	 */
  	var merge = createAssigner(function(object, source, srcIndex) {
  	  baseMerge(object, source, srcIndex);
  	});

  	merge_1 = merge;
  	return merge_1;
  }

  /**
   * The base implementation of `_.lt` which doesn't coerce arguments.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if `value` is less than `other`,
   *  else `false`.
   */

  var _baseLt;
  var hasRequired_baseLt;

  function require_baseLt () {
  	if (hasRequired_baseLt) return _baseLt;
  	hasRequired_baseLt = 1;
  	function baseLt(value, other) {
  	  return value < other;
  	}

  	_baseLt = baseLt;
  	return _baseLt;
  }

  var min_1;
  var hasRequiredMin;

  function requireMin () {
  	if (hasRequiredMin) return min_1;
  	hasRequiredMin = 1;
  	var baseExtremum = require_baseExtremum(),
  	    baseLt = require_baseLt(),
  	    identity = requireIdentity();

  	/**
  	 * Computes the minimum value of `array`. If `array` is empty or falsey,
  	 * `undefined` is returned.
  	 *
  	 * @static
  	 * @since 0.1.0
  	 * @memberOf _
  	 * @category Math
  	 * @param {Array} array The array to iterate over.
  	 * @returns {*} Returns the minimum value.
  	 * @example
  	 *
  	 * _.min([4, 2, 8, 6]);
  	 * // => 2
  	 *
  	 * _.min([]);
  	 * // => undefined
  	 */
  	function min(array) {
  	  return (array && array.length)
  	    ? baseExtremum(array, identity, baseLt)
  	    : undefined;
  	}

  	min_1 = min;
  	return min_1;
  }

  var minBy_1;
  var hasRequiredMinBy;

  function requireMinBy () {
  	if (hasRequiredMinBy) return minBy_1;
  	hasRequiredMinBy = 1;
  	var baseExtremum = require_baseExtremum(),
  	    baseIteratee = require_baseIteratee(),
  	    baseLt = require_baseLt();

  	/**
  	 * This method is like `_.min` except that it accepts `iteratee` which is
  	 * invoked for each element in `array` to generate the criterion by which
  	 * the value is ranked. The iteratee is invoked with one argument: (value).
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 4.0.0
  	 * @category Math
  	 * @param {Array} array The array to iterate over.
  	 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
  	 * @returns {*} Returns the minimum value.
  	 * @example
  	 *
  	 * var objects = [{ 'n': 1 }, { 'n': 2 }];
  	 *
  	 * _.minBy(objects, function(o) { return o.n; });
  	 * // => { 'n': 1 }
  	 *
  	 * // The `_.property` iteratee shorthand.
  	 * _.minBy(objects, 'n');
  	 * // => { 'n': 1 }
  	 */
  	function minBy(array, iteratee) {
  	  return (array && array.length)
  	    ? baseExtremum(array, baseIteratee(iteratee, 2), baseLt)
  	    : undefined;
  	}

  	minBy_1 = minBy;
  	return minBy_1;
  }

  var now_1;
  var hasRequiredNow;

  function requireNow () {
  	if (hasRequiredNow) return now_1;
  	hasRequiredNow = 1;
  	var root = require_root();

  	/**
  	 * Gets the timestamp of the number of milliseconds that have elapsed since
  	 * the Unix epoch (1 January 1970 00:00:00 UTC).
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 2.4.0
  	 * @category Date
  	 * @returns {number} Returns the timestamp.
  	 * @example
  	 *
  	 * _.defer(function(stamp) {
  	 *   console.log(_.now() - stamp);
  	 * }, _.now());
  	 * // => Logs the number of milliseconds it took for the deferred invocation.
  	 */
  	var now = function() {
  	  return root.Date.now();
  	};

  	now_1 = now;
  	return now_1;
  }

  var _baseSet;
  var hasRequired_baseSet;

  function require_baseSet () {
  	if (hasRequired_baseSet) return _baseSet;
  	hasRequired_baseSet = 1;
  	var assignValue = require_assignValue(),
  	    castPath = require_castPath(),
  	    isIndex = require_isIndex(),
  	    isObject = requireIsObject(),
  	    toKey = require_toKey();

  	/**
  	 * The base implementation of `_.set`.
  	 *
  	 * @private
  	 * @param {Object} object The object to modify.
  	 * @param {Array|string} path The path of the property to set.
  	 * @param {*} value The value to set.
  	 * @param {Function} [customizer] The function to customize path creation.
  	 * @returns {Object} Returns `object`.
  	 */
  	function baseSet(object, path, value, customizer) {
  	  if (!isObject(object)) {
  	    return object;
  	  }
  	  path = castPath(path, object);

  	  var index = -1,
  	      length = path.length,
  	      lastIndex = length - 1,
  	      nested = object;

  	  while (nested != null && ++index < length) {
  	    var key = toKey(path[index]),
  	        newValue = value;

  	    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
  	      return object;
  	    }

  	    if (index != lastIndex) {
  	      var objValue = nested[key];
  	      newValue = customizer ? customizer(objValue, key, nested) : undefined;
  	      if (newValue === undefined) {
  	        newValue = isObject(objValue)
  	          ? objValue
  	          : (isIndex(path[index + 1]) ? [] : {});
  	      }
  	    }
  	    assignValue(nested, key, newValue);
  	    nested = nested[key];
  	  }
  	  return object;
  	}

  	_baseSet = baseSet;
  	return _baseSet;
  }

  var _basePickBy;
  var hasRequired_basePickBy;

  function require_basePickBy () {
  	if (hasRequired_basePickBy) return _basePickBy;
  	hasRequired_basePickBy = 1;
  	var baseGet = require_baseGet(),
  	    baseSet = require_baseSet(),
  	    castPath = require_castPath();

  	/**
  	 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
  	 *
  	 * @private
  	 * @param {Object} object The source object.
  	 * @param {string[]} paths The property paths to pick.
  	 * @param {Function} predicate The function invoked per property.
  	 * @returns {Object} Returns the new object.
  	 */
  	function basePickBy(object, paths, predicate) {
  	  var index = -1,
  	      length = paths.length,
  	      result = {};

  	  while (++index < length) {
  	    var path = paths[index],
  	        value = baseGet(object, path);

  	    if (predicate(value, path)) {
  	      baseSet(result, castPath(path, object), value);
  	    }
  	  }
  	  return result;
  	}

  	_basePickBy = basePickBy;
  	return _basePickBy;
  }

  var _basePick;
  var hasRequired_basePick;

  function require_basePick () {
  	if (hasRequired_basePick) return _basePick;
  	hasRequired_basePick = 1;
  	var basePickBy = require_basePickBy(),
  	    hasIn = requireHasIn();

  	/**
  	 * The base implementation of `_.pick` without support for individual
  	 * property identifiers.
  	 *
  	 * @private
  	 * @param {Object} object The source object.
  	 * @param {string[]} paths The property paths to pick.
  	 * @returns {Object} Returns the new object.
  	 */
  	function basePick(object, paths) {
  	  return basePickBy(object, paths, function(value, path) {
  	    return hasIn(object, path);
  	  });
  	}

  	_basePick = basePick;
  	return _basePick;
  }

  var _flatRest;
  var hasRequired_flatRest;

  function require_flatRest () {
  	if (hasRequired_flatRest) return _flatRest;
  	hasRequired_flatRest = 1;
  	var flatten = requireFlatten(),
  	    overRest = require_overRest(),
  	    setToString = require_setToString();

  	/**
  	 * A specialized version of `baseRest` which flattens the rest array.
  	 *
  	 * @private
  	 * @param {Function} func The function to apply a rest parameter to.
  	 * @returns {Function} Returns the new function.
  	 */
  	function flatRest(func) {
  	  return setToString(overRest(func, undefined, flatten), func + '');
  	}

  	_flatRest = flatRest;
  	return _flatRest;
  }

  var pick_1;
  var hasRequiredPick;

  function requirePick () {
  	if (hasRequiredPick) return pick_1;
  	hasRequiredPick = 1;
  	var basePick = require_basePick(),
  	    flatRest = require_flatRest();

  	/**
  	 * Creates an object composed of the picked `object` properties.
  	 *
  	 * @static
  	 * @since 0.1.0
  	 * @memberOf _
  	 * @category Object
  	 * @param {Object} object The source object.
  	 * @param {...(string|string[])} [paths] The property paths to pick.
  	 * @returns {Object} Returns the new object.
  	 * @example
  	 *
  	 * var object = { 'a': 1, 'b': '2', 'c': 3 };
  	 *
  	 * _.pick(object, ['a', 'c']);
  	 * // => { 'a': 1, 'c': 3 }
  	 */
  	var pick = flatRest(function(object, paths) {
  	  return object == null ? {} : basePick(object, paths);
  	});

  	pick_1 = pick;
  	return pick_1;
  }

  /* Built-in method references for those with the same name as other `lodash` methods. */

  var _baseRange;
  var hasRequired_baseRange;

  function require_baseRange () {
  	if (hasRequired_baseRange) return _baseRange;
  	hasRequired_baseRange = 1;
  	var nativeCeil = Math.ceil,
  	    nativeMax = Math.max;

  	/**
  	 * The base implementation of `_.range` and `_.rangeRight` which doesn't
  	 * coerce arguments.
  	 *
  	 * @private
  	 * @param {number} start The start of the range.
  	 * @param {number} end The end of the range.
  	 * @param {number} step The value to increment or decrement by.
  	 * @param {boolean} [fromRight] Specify iterating from right to left.
  	 * @returns {Array} Returns the range of numbers.
  	 */
  	function baseRange(start, end, step, fromRight) {
  	  var index = -1,
  	      length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
  	      result = Array(length);

  	  while (length--) {
  	    result[fromRight ? length : ++index] = start;
  	    start += step;
  	  }
  	  return result;
  	}

  	_baseRange = baseRange;
  	return _baseRange;
  }

  var _createRange;
  var hasRequired_createRange;

  function require_createRange () {
  	if (hasRequired_createRange) return _createRange;
  	hasRequired_createRange = 1;
  	var baseRange = require_baseRange(),
  	    isIterateeCall = require_isIterateeCall(),
  	    toFinite = requireToFinite();

  	/**
  	 * Creates a `_.range` or `_.rangeRight` function.
  	 *
  	 * @private
  	 * @param {boolean} [fromRight] Specify iterating from right to left.
  	 * @returns {Function} Returns the new range function.
  	 */
  	function createRange(fromRight) {
  	  return function(start, end, step) {
  	    if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
  	      end = step = undefined;
  	    }
  	    // Ensure the sign of `-0` is preserved.
  	    start = toFinite(start);
  	    if (end === undefined) {
  	      end = start;
  	      start = 0;
  	    } else {
  	      end = toFinite(end);
  	    }
  	    step = step === undefined ? (start < end ? 1 : -1) : toFinite(step);
  	    return baseRange(start, end, step, fromRight);
  	  };
  	}

  	_createRange = createRange;
  	return _createRange;
  }

  var range_1;
  var hasRequiredRange;

  function requireRange () {
  	if (hasRequiredRange) return range_1;
  	hasRequiredRange = 1;
  	var createRange = require_createRange();

  	/**
  	 * Creates an array of numbers (positive and/or negative) progressing from
  	 * `start` up to, but not including, `end`. A step of `-1` is used if a negative
  	 * `start` is specified without an `end` or `step`. If `end` is not specified,
  	 * it's set to `start` with `start` then set to `0`.
  	 *
  	 * **Note:** JavaScript follows the IEEE-754 standard for resolving
  	 * floating-point values which can produce unexpected results.
  	 *
  	 * @static
  	 * @since 0.1.0
  	 * @memberOf _
  	 * @category Util
  	 * @param {number} [start=0] The start of the range.
  	 * @param {number} end The end of the range.
  	 * @param {number} [step=1] The value to increment or decrement by.
  	 * @returns {Array} Returns the range of numbers.
  	 * @see _.inRange, _.rangeRight
  	 * @example
  	 *
  	 * _.range(4);
  	 * // => [0, 1, 2, 3]
  	 *
  	 * _.range(-4);
  	 * // => [0, -1, -2, -3]
  	 *
  	 * _.range(1, 5);
  	 * // => [1, 2, 3, 4]
  	 *
  	 * _.range(0, 20, 5);
  	 * // => [0, 5, 10, 15]
  	 *
  	 * _.range(0, -4, -1);
  	 * // => [0, -1, -2, -3]
  	 *
  	 * _.range(1, 4, 0);
  	 * // => [1, 1, 1]
  	 *
  	 * _.range(0);
  	 * // => []
  	 */
  	var range = createRange();

  	range_1 = range;
  	return range_1;
  }

  /**
   * The base implementation of `_.sortBy` which uses `comparer` to define the
   * sort order of `array` and replaces criteria objects with their corresponding
   * values.
   *
   * @private
   * @param {Array} array The array to sort.
   * @param {Function} comparer The function to define sort order.
   * @returns {Array} Returns `array`.
   */

  var _baseSortBy;
  var hasRequired_baseSortBy;

  function require_baseSortBy () {
  	if (hasRequired_baseSortBy) return _baseSortBy;
  	hasRequired_baseSortBy = 1;
  	function baseSortBy(array, comparer) {
  	  var length = array.length;

  	  array.sort(comparer);
  	  while (length--) {
  	    array[length] = array[length].value;
  	  }
  	  return array;
  	}

  	_baseSortBy = baseSortBy;
  	return _baseSortBy;
  }

  var _compareAscending;
  var hasRequired_compareAscending;

  function require_compareAscending () {
  	if (hasRequired_compareAscending) return _compareAscending;
  	hasRequired_compareAscending = 1;
  	var isSymbol = requireIsSymbol();

  	/**
  	 * Compares values to sort them in ascending order.
  	 *
  	 * @private
  	 * @param {*} value The value to compare.
  	 * @param {*} other The other value to compare.
  	 * @returns {number} Returns the sort order indicator for `value`.
  	 */
  	function compareAscending(value, other) {
  	  if (value !== other) {
  	    var valIsDefined = value !== undefined,
  	        valIsNull = value === null,
  	        valIsReflexive = value === value,
  	        valIsSymbol = isSymbol(value);

  	    var othIsDefined = other !== undefined,
  	        othIsNull = other === null,
  	        othIsReflexive = other === other,
  	        othIsSymbol = isSymbol(other);

  	    if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
  	        (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
  	        (valIsNull && othIsDefined && othIsReflexive) ||
  	        (!valIsDefined && othIsReflexive) ||
  	        !valIsReflexive) {
  	      return 1;
  	    }
  	    if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
  	        (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
  	        (othIsNull && valIsDefined && valIsReflexive) ||
  	        (!othIsDefined && valIsReflexive) ||
  	        !othIsReflexive) {
  	      return -1;
  	    }
  	  }
  	  return 0;
  	}

  	_compareAscending = compareAscending;
  	return _compareAscending;
  }

  var _compareMultiple;
  var hasRequired_compareMultiple;

  function require_compareMultiple () {
  	if (hasRequired_compareMultiple) return _compareMultiple;
  	hasRequired_compareMultiple = 1;
  	var compareAscending = require_compareAscending();

  	/**
  	 * Used by `_.orderBy` to compare multiple properties of a value to another
  	 * and stable sort them.
  	 *
  	 * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
  	 * specify an order of "desc" for descending or "asc" for ascending sort order
  	 * of corresponding values.
  	 *
  	 * @private
  	 * @param {Object} object The object to compare.
  	 * @param {Object} other The other object to compare.
  	 * @param {boolean[]|string[]} orders The order to sort by for each property.
  	 * @returns {number} Returns the sort order indicator for `object`.
  	 */
  	function compareMultiple(object, other, orders) {
  	  var index = -1,
  	      objCriteria = object.criteria,
  	      othCriteria = other.criteria,
  	      length = objCriteria.length,
  	      ordersLength = orders.length;

  	  while (++index < length) {
  	    var result = compareAscending(objCriteria[index], othCriteria[index]);
  	    if (result) {
  	      if (index >= ordersLength) {
  	        return result;
  	      }
  	      var order = orders[index];
  	      return result * (order == 'desc' ? -1 : 1);
  	    }
  	  }
  	  // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
  	  // that causes it, under certain circumstances, to provide the same value for
  	  // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
  	  // for more details.
  	  //
  	  // This also ensures a stable sort in V8 and other engines.
  	  // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
  	  return object.index - other.index;
  	}

  	_compareMultiple = compareMultiple;
  	return _compareMultiple;
  }

  var _baseOrderBy;
  var hasRequired_baseOrderBy;

  function require_baseOrderBy () {
  	if (hasRequired_baseOrderBy) return _baseOrderBy;
  	hasRequired_baseOrderBy = 1;
  	var arrayMap = require_arrayMap(),
  	    baseGet = require_baseGet(),
  	    baseIteratee = require_baseIteratee(),
  	    baseMap = require_baseMap(),
  	    baseSortBy = require_baseSortBy(),
  	    baseUnary = require_baseUnary(),
  	    compareMultiple = require_compareMultiple(),
  	    identity = requireIdentity(),
  	    isArray = requireIsArray();

  	/**
  	 * The base implementation of `_.orderBy` without param guards.
  	 *
  	 * @private
  	 * @param {Array|Object} collection The collection to iterate over.
  	 * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
  	 * @param {string[]} orders The sort orders of `iteratees`.
  	 * @returns {Array} Returns the new sorted array.
  	 */
  	function baseOrderBy(collection, iteratees, orders) {
  	  if (iteratees.length) {
  	    iteratees = arrayMap(iteratees, function(iteratee) {
  	      if (isArray(iteratee)) {
  	        return function(value) {
  	          return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
  	        }
  	      }
  	      return iteratee;
  	    });
  	  } else {
  	    iteratees = [identity];
  	  }

  	  var index = -1;
  	  iteratees = arrayMap(iteratees, baseUnary(baseIteratee));

  	  var result = baseMap(collection, function(value, key, collection) {
  	    var criteria = arrayMap(iteratees, function(iteratee) {
  	      return iteratee(value);
  	    });
  	    return { 'criteria': criteria, 'index': ++index, 'value': value };
  	  });

  	  return baseSortBy(result, function(object, other) {
  	    return compareMultiple(object, other, orders);
  	  });
  	}

  	_baseOrderBy = baseOrderBy;
  	return _baseOrderBy;
  }

  var sortBy_1;
  var hasRequiredSortBy;

  function requireSortBy () {
  	if (hasRequiredSortBy) return sortBy_1;
  	hasRequiredSortBy = 1;
  	var baseFlatten = require_baseFlatten(),
  	    baseOrderBy = require_baseOrderBy(),
  	    baseRest = require_baseRest(),
  	    isIterateeCall = require_isIterateeCall();

  	/**
  	 * Creates an array of elements, sorted in ascending order by the results of
  	 * running each element in a collection thru each iteratee. This method
  	 * performs a stable sort, that is, it preserves the original sort order of
  	 * equal elements. The iteratees are invoked with one argument: (value).
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 0.1.0
  	 * @category Collection
  	 * @param {Array|Object} collection The collection to iterate over.
  	 * @param {...(Function|Function[])} [iteratees=[_.identity]]
  	 *  The iteratees to sort by.
  	 * @returns {Array} Returns the new sorted array.
  	 * @example
  	 *
  	 * var users = [
  	 *   { 'user': 'fred',   'age': 48 },
  	 *   { 'user': 'barney', 'age': 36 },
  	 *   { 'user': 'fred',   'age': 30 },
  	 *   { 'user': 'barney', 'age': 34 }
  	 * ];
  	 *
  	 * _.sortBy(users, [function(o) { return o.user; }]);
  	 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 30]]
  	 *
  	 * _.sortBy(users, ['user', 'age']);
  	 * // => objects for [['barney', 34], ['barney', 36], ['fred', 30], ['fred', 48]]
  	 */
  	var sortBy = baseRest(function(collection, iteratees) {
  	  if (collection == null) {
  	    return [];
  	  }
  	  var length = iteratees.length;
  	  if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
  	    iteratees = [];
  	  } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
  	    iteratees = [iteratees[0]];
  	  }
  	  return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
  	});

  	sortBy_1 = sortBy;
  	return sortBy_1;
  }

  var uniqueId_1;
  var hasRequiredUniqueId;

  function requireUniqueId () {
  	if (hasRequiredUniqueId) return uniqueId_1;
  	hasRequiredUniqueId = 1;
  	var toString = requireToString();

  	/** Used to generate unique IDs. */
  	var idCounter = 0;

  	/**
  	 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
  	 *
  	 * @static
  	 * @since 0.1.0
  	 * @memberOf _
  	 * @category Util
  	 * @param {string} [prefix=''] The value to prefix the ID with.
  	 * @returns {string} Returns the unique ID.
  	 * @example
  	 *
  	 * _.uniqueId('contact_');
  	 * // => 'contact_104'
  	 *
  	 * _.uniqueId();
  	 * // => '105'
  	 */
  	function uniqueId(prefix) {
  	  var id = ++idCounter;
  	  return toString(prefix) + id;
  	}

  	uniqueId_1 = uniqueId;
  	return uniqueId_1;
  }

  /**
   * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
   *
   * @private
   * @param {Array} props The property identifiers.
   * @param {Array} values The property values.
   * @param {Function} assignFunc The function to assign values.
   * @returns {Object} Returns the new object.
   */

  var _baseZipObject;
  var hasRequired_baseZipObject;

  function require_baseZipObject () {
  	if (hasRequired_baseZipObject) return _baseZipObject;
  	hasRequired_baseZipObject = 1;
  	function baseZipObject(props, values, assignFunc) {
  	  var index = -1,
  	      length = props.length,
  	      valsLength = values.length,
  	      result = {};

  	  while (++index < length) {
  	    var value = index < valsLength ? values[index] : undefined;
  	    assignFunc(result, props[index], value);
  	  }
  	  return result;
  	}

  	_baseZipObject = baseZipObject;
  	return _baseZipObject;
  }

  var zipObject_1;
  var hasRequiredZipObject;

  function requireZipObject () {
  	if (hasRequiredZipObject) return zipObject_1;
  	hasRequiredZipObject = 1;
  	var assignValue = require_assignValue(),
  	    baseZipObject = require_baseZipObject();

  	/**
  	 * This method is like `_.fromPairs` except that it accepts two arrays,
  	 * one of property identifiers and one of corresponding values.
  	 *
  	 * @static
  	 * @memberOf _
  	 * @since 0.4.0
  	 * @category Array
  	 * @param {Array} [props=[]] The property identifiers.
  	 * @param {Array} [values=[]] The property values.
  	 * @returns {Object} Returns the new object.
  	 * @example
  	 *
  	 * _.zipObject(['a', 'b'], [1, 2]);
  	 * // => { 'a': 1, 'b': 2 }
  	 */
  	function zipObject(props, values) {
  	  return baseZipObject(props || [], values || [], assignValue);
  	}

  	zipObject_1 = zipObject;
  	return zipObject_1;
  }

  /* global window */

  var lodash_1;
  var hasRequiredLodash;

  function requireLodash () {
  	if (hasRequiredLodash) return lodash_1;
  	hasRequiredLodash = 1;
  	var lodash;

  	if (typeof commonjsRequire === "function") {
  	  try {
  	    lodash = {
  	      cloneDeep: requireCloneDeep(),
  	      constant: requireConstant(),
  	      defaults: requireDefaults(),
  	      each: requireEach(),
  	      filter: requireFilter(),
  	      find: requireFind(),
  	      flatten: requireFlatten(),
  	      forEach: requireForEach(),
  	      forIn: requireForIn(),
  	      has:  requireHas(),
  	      isUndefined: requireIsUndefined(),
  	      last: requireLast(),
  	      map: requireMap(),
  	      mapValues: requireMapValues(),
  	      max: requireMax(),
  	      merge: requireMerge(),
  	      min: requireMin(),
  	      minBy: requireMinBy(),
  	      now: requireNow(),
  	      pick: requirePick(),
  	      range: requireRange(),
  	      reduce: requireReduce(),
  	      sortBy: requireSortBy(),
  	      uniqueId: requireUniqueId(),
  	      values: requireValues(),
  	      zipObject: requireZipObject(),
  	    };
  	  } catch (e) {
  	    // continue regardless of error
  	  }
  	}

  	if (!lodash) {
  	  lodash = window._;
  	}

  	lodash_1 = lodash;
  	return lodash_1;
  }

  /*
   * Simple doubly linked list implementation derived from Cormen, et al.,
   * "Introduction to Algorithms".
   */

  var list;
  var hasRequiredList;

  function requireList () {
  	if (hasRequiredList) return list;
  	hasRequiredList = 1;
  	list = List;

  	function List() {
  	  var sentinel = {};
  	  sentinel._next = sentinel._prev = sentinel;
  	  this._sentinel = sentinel;
  	}

  	List.prototype.dequeue = function() {
  	  var sentinel = this._sentinel;
  	  var entry = sentinel._prev;
  	  if (entry !== sentinel) {
  	    unlink(entry);
  	    return entry;
  	  }
  	};

  	List.prototype.enqueue = function(entry) {
  	  var sentinel = this._sentinel;
  	  if (entry._prev && entry._next) {
  	    unlink(entry);
  	  }
  	  entry._next = sentinel._next;
  	  sentinel._next._prev = entry;
  	  sentinel._next = entry;
  	  entry._prev = sentinel;
  	};

  	List.prototype.toString = function() {
  	  var strs = [];
  	  var sentinel = this._sentinel;
  	  var curr = sentinel._prev;
  	  while (curr !== sentinel) {
  	    strs.push(JSON.stringify(curr, filterOutLinks));
  	    curr = curr._prev;
  	  }
  	  return "[" + strs.join(", ") + "]";
  	};

  	function unlink(entry) {
  	  entry._prev._next = entry._next;
  	  entry._next._prev = entry._prev;
  	  delete entry._next;
  	  delete entry._prev;
  	}

  	function filterOutLinks(k, v) {
  	  if (k !== "_next" && k !== "_prev") {
  	    return v;
  	  }
  	}
  	return list;
  }

  var greedyFas;
  var hasRequiredGreedyFas;

  function requireGreedyFas () {
  	if (hasRequiredGreedyFas) return greedyFas;
  	hasRequiredGreedyFas = 1;
  	var _ = requireLodash();
  	var Graph = requireGraphlib().Graph;
  	var List = requireList();

  	/*
  	 * A greedy heuristic for finding a feedback arc set for a graph. A feedback
  	 * arc set is a set of edges that can be removed to make a graph acyclic.
  	 * The algorithm comes from: P. Eades, X. Lin, and W. F. Smyth, "A fast and
  	 * effective heuristic for the feedback arc set problem." This implementation
  	 * adjusts that from the paper to allow for weighted edges.
  	 */
  	greedyFas = greedyFAS;

  	var DEFAULT_WEIGHT_FN = _.constant(1);

  	function greedyFAS(g, weightFn) {
  	  if (g.nodeCount() <= 1) {
  	    return [];
  	  }
  	  var state = buildState(g, weightFn || DEFAULT_WEIGHT_FN);
  	  var results = doGreedyFAS(state.graph, state.buckets, state.zeroIdx);

  	  // Expand multi-edges
  	  return _.flatten(_.map(results, function(e) {
  	    return g.outEdges(e.v, e.w);
  	  }), true);
  	}

  	function doGreedyFAS(g, buckets, zeroIdx) {
  	  var results = [];
  	  var sources = buckets[buckets.length - 1];
  	  var sinks = buckets[0];

  	  var entry;
  	  while (g.nodeCount()) {
  	    while ((entry = sinks.dequeue()))   { removeNode(g, buckets, zeroIdx, entry); }
  	    while ((entry = sources.dequeue())) { removeNode(g, buckets, zeroIdx, entry); }
  	    if (g.nodeCount()) {
  	      for (var i = buckets.length - 2; i > 0; --i) {
  	        entry = buckets[i].dequeue();
  	        if (entry) {
  	          results = results.concat(removeNode(g, buckets, zeroIdx, entry, true));
  	          break;
  	        }
  	      }
  	    }
  	  }

  	  return results;
  	}

  	function removeNode(g, buckets, zeroIdx, entry, collectPredecessors) {
  	  var results = collectPredecessors ? [] : undefined;

  	  _.forEach(g.inEdges(entry.v), function(edge) {
  	    var weight = g.edge(edge);
  	    var uEntry = g.node(edge.v);

  	    if (collectPredecessors) {
  	      results.push({ v: edge.v, w: edge.w });
  	    }

  	    uEntry.out -= weight;
  	    assignBucket(buckets, zeroIdx, uEntry);
  	  });

  	  _.forEach(g.outEdges(entry.v), function(edge) {
  	    var weight = g.edge(edge);
  	    var w = edge.w;
  	    var wEntry = g.node(w);
  	    wEntry["in"] -= weight;
  	    assignBucket(buckets, zeroIdx, wEntry);
  	  });

  	  g.removeNode(entry.v);

  	  return results;
  	}

  	function buildState(g, weightFn) {
  	  var fasGraph = new Graph();
  	  var maxIn = 0;
  	  var maxOut = 0;

  	  _.forEach(g.nodes(), function(v) {
  	    fasGraph.setNode(v, { v: v, "in": 0, out: 0 });
  	  });

  	  // Aggregate weights on nodes, but also sum the weights across multi-edges
  	  // into a single edge for the fasGraph.
  	  _.forEach(g.edges(), function(e) {
  	    var prevWeight = fasGraph.edge(e.v, e.w) || 0;
  	    var weight = weightFn(e);
  	    var edgeWeight = prevWeight + weight;
  	    fasGraph.setEdge(e.v, e.w, edgeWeight);
  	    maxOut = Math.max(maxOut, fasGraph.node(e.v).out += weight);
  	    maxIn  = Math.max(maxIn,  fasGraph.node(e.w)["in"]  += weight);
  	  });

  	  var buckets = _.range(maxOut + maxIn + 3).map(function() { return new List(); });
  	  var zeroIdx = maxIn + 1;

  	  _.forEach(fasGraph.nodes(), function(v) {
  	    assignBucket(buckets, zeroIdx, fasGraph.node(v));
  	  });

  	  return { graph: fasGraph, buckets: buckets, zeroIdx: zeroIdx };
  	}

  	function assignBucket(buckets, zeroIdx, entry) {
  	  if (!entry.out) {
  	    buckets[0].enqueue(entry);
  	  } else if (!entry["in"]) {
  	    buckets[buckets.length - 1].enqueue(entry);
  	  } else {
  	    buckets[entry.out - entry["in"] + zeroIdx].enqueue(entry);
  	  }
  	}
  	return greedyFas;
  }

  var acyclic;
  var hasRequiredAcyclic;

  function requireAcyclic () {
  	if (hasRequiredAcyclic) return acyclic;
  	hasRequiredAcyclic = 1;

  	var _ = requireLodash();
  	var greedyFAS = requireGreedyFas();

  	acyclic = {
  	  run: run,
  	  undo: undo
  	};

  	function run(g) {
  	  var fas = (g.graph().acyclicer === "greedy"
  	    ? greedyFAS(g, weightFn(g))
  	    : dfsFAS(g));
  	  _.forEach(fas, function(e) {
  	    var label = g.edge(e);
  	    g.removeEdge(e);
  	    label.forwardName = e.name;
  	    label.reversed = true;
  	    g.setEdge(e.w, e.v, label, _.uniqueId("rev"));
  	  });

  	  function weightFn(g) {
  	    return function(e) {
  	      return g.edge(e).weight;
  	    };
  	  }
  	}

  	function dfsFAS(g) {
  	  var fas = [];
  	  var stack = {};
  	  var visited = {};

  	  function dfs(v) {
  	    if (_.has(visited, v)) {
  	      return;
  	    }
  	    visited[v] = true;
  	    stack[v] = true;
  	    _.forEach(g.outEdges(v), function(e) {
  	      if (_.has(stack, e.w)) {
  	        fas.push(e);
  	      } else {
  	        dfs(e.w);
  	      }
  	    });
  	    delete stack[v];
  	  }

  	  _.forEach(g.nodes(), dfs);
  	  return fas;
  	}

  	function undo(g) {
  	  _.forEach(g.edges(), function(e) {
  	    var label = g.edge(e);
  	    if (label.reversed) {
  	      g.removeEdge(e);

  	      var forwardName = label.forwardName;
  	      delete label.reversed;
  	      delete label.forwardName;
  	      g.setEdge(e.w, e.v, label, forwardName);
  	    }
  	  });
  	}
  	return acyclic;
  }

  /* eslint "no-console": off */

  var util$1;
  var hasRequiredUtil$1;

  function requireUtil$1 () {
  	if (hasRequiredUtil$1) return util$1;
  	hasRequiredUtil$1 = 1;

  	var _ = requireLodash();
  	var Graph = requireGraphlib().Graph;

  	util$1 = {
  	  addDummyNode: addDummyNode,
  	  simplify: simplify,
  	  asNonCompoundGraph: asNonCompoundGraph,
  	  successorWeights: successorWeights,
  	  predecessorWeights: predecessorWeights,
  	  intersectRect: intersectRect,
  	  buildLayerMatrix: buildLayerMatrix,
  	  normalizeRanks: normalizeRanks,
  	  removeEmptyRanks: removeEmptyRanks,
  	  addBorderNode: addBorderNode,
  	  maxRank: maxRank,
  	  partition: partition,
  	  time: time,
  	  notime: notime
  	};

  	/*
  	 * Adds a dummy node to the graph and return v.
  	 */
  	function addDummyNode(g, type, attrs, name) {
  	  var v;
  	  do {
  	    v = _.uniqueId(name);
  	  } while (g.hasNode(v));

  	  attrs.dummy = type;
  	  g.setNode(v, attrs);
  	  return v;
  	}

  	/*
  	 * Returns a new graph with only simple edges. Handles aggregation of data
  	 * associated with multi-edges.
  	 */
  	function simplify(g) {
  	  var simplified = new Graph().setGraph(g.graph());
  	  _.forEach(g.nodes(), function(v) { simplified.setNode(v, g.node(v)); });
  	  _.forEach(g.edges(), function(e) {
  	    var simpleLabel = simplified.edge(e.v, e.w) || { weight: 0, minlen: 1 };
  	    var label = g.edge(e);
  	    simplified.setEdge(e.v, e.w, {
  	      weight: simpleLabel.weight + label.weight,
  	      minlen: Math.max(simpleLabel.minlen, label.minlen)
  	    });
  	  });
  	  return simplified;
  	}

  	function asNonCompoundGraph(g) {
  	  var simplified = new Graph({ multigraph: g.isMultigraph() }).setGraph(g.graph());
  	  _.forEach(g.nodes(), function(v) {
  	    if (!g.children(v).length) {
  	      simplified.setNode(v, g.node(v));
  	    }
  	  });
  	  _.forEach(g.edges(), function(e) {
  	    simplified.setEdge(e, g.edge(e));
  	  });
  	  return simplified;
  	}

  	function successorWeights(g) {
  	  var weightMap = _.map(g.nodes(), function(v) {
  	    var sucs = {};
  	    _.forEach(g.outEdges(v), function(e) {
  	      sucs[e.w] = (sucs[e.w] || 0) + g.edge(e).weight;
  	    });
  	    return sucs;
  	  });
  	  return _.zipObject(g.nodes(), weightMap);
  	}

  	function predecessorWeights(g) {
  	  var weightMap = _.map(g.nodes(), function(v) {
  	    var preds = {};
  	    _.forEach(g.inEdges(v), function(e) {
  	      preds[e.v] = (preds[e.v] || 0) + g.edge(e).weight;
  	    });
  	    return preds;
  	  });
  	  return _.zipObject(g.nodes(), weightMap);
  	}

  	/*
  	 * Finds where a line starting at point ({x, y}) would intersect a rectangle
  	 * ({x, y, width, height}) if it were pointing at the rectangle's center.
  	 */
  	function intersectRect(rect, point) {
  	  var x = rect.x;
  	  var y = rect.y;

  	  // Rectangle intersection algorithm from:
  	  // http://math.stackexchange.com/questions/108113/find-edge-between-two-boxes
  	  var dx = point.x - x;
  	  var dy = point.y - y;
  	  var w = rect.width / 2;
  	  var h = rect.height / 2;

  	  if (!dx && !dy) {
  	    throw new Error("Not possible to find intersection inside of the rectangle");
  	  }

  	  var sx, sy;
  	  if (Math.abs(dy) * w > Math.abs(dx) * h) {
  	    // Intersection is top or bottom of rect.
  	    if (dy < 0) {
  	      h = -h;
  	    }
  	    sx = h * dx / dy;
  	    sy = h;
  	  } else {
  	    // Intersection is left or right of rect.
  	    if (dx < 0) {
  	      w = -w;
  	    }
  	    sx = w;
  	    sy = w * dy / dx;
  	  }

  	  return { x: x + sx, y: y + sy };
  	}

  	/*
  	 * Given a DAG with each node assigned "rank" and "order" properties, this
  	 * function will produce a matrix with the ids of each node.
  	 */
  	function buildLayerMatrix(g) {
  	  var layering = _.map(_.range(maxRank(g) + 1), function() { return []; });
  	  _.forEach(g.nodes(), function(v) {
  	    var node = g.node(v);
  	    var rank = node.rank;
  	    if (!_.isUndefined(rank)) {
  	      layering[rank][node.order] = v;
  	    }
  	  });
  	  return layering;
  	}

  	/*
  	 * Adjusts the ranks for all nodes in the graph such that all nodes v have
  	 * rank(v) >= 0 and at least one node w has rank(w) = 0.
  	 */
  	function normalizeRanks(g) {
  	  var min = _.min(_.map(g.nodes(), function(v) { return g.node(v).rank; }));
  	  _.forEach(g.nodes(), function(v) {
  	    var node = g.node(v);
  	    if (_.has(node, "rank")) {
  	      node.rank -= min;
  	    }
  	  });
  	}

  	function removeEmptyRanks(g) {
  	  // Ranks may not start at 0, so we need to offset them
  	  var offset = _.min(_.map(g.nodes(), function(v) { return g.node(v).rank; }));

  	  var layers = [];
  	  _.forEach(g.nodes(), function(v) {
  	    var rank = g.node(v).rank - offset;
  	    if (!layers[rank]) {
  	      layers[rank] = [];
  	    }
  	    layers[rank].push(v);
  	  });

  	  var delta = 0;
  	  var nodeRankFactor = g.graph().nodeRankFactor;
  	  _.forEach(layers, function(vs, i) {
  	    if (_.isUndefined(vs) && i % nodeRankFactor !== 0) {
  	      --delta;
  	    } else if (delta) {
  	      _.forEach(vs, function(v) { g.node(v).rank += delta; });
  	    }
  	  });
  	}

  	function addBorderNode(g, prefix, rank, order) {
  	  var node = {
  	    width: 0,
  	    height: 0
  	  };
  	  if (arguments.length >= 4) {
  	    node.rank = rank;
  	    node.order = order;
  	  }
  	  return addDummyNode(g, "border", node, prefix);
  	}

  	function maxRank(g) {
  	  return _.max(_.map(g.nodes(), function(v) {
  	    var rank = g.node(v).rank;
  	    if (!_.isUndefined(rank)) {
  	      return rank;
  	    }
  	  }));
  	}

  	/*
  	 * Partition a collection into two groups: `lhs` and `rhs`. If the supplied
  	 * function returns true for an entry it goes into `lhs`. Otherwise it goes
  	 * into `rhs.
  	 */
  	function partition(collection, fn) {
  	  var result = { lhs: [], rhs: [] };
  	  _.forEach(collection, function(value) {
  	    if (fn(value)) {
  	      result.lhs.push(value);
  	    } else {
  	      result.rhs.push(value);
  	    }
  	  });
  	  return result;
  	}

  	/*
  	 * Returns a new function that wraps `fn` with a timer. The wrapper logs the
  	 * time it takes to execute the function.
  	 */
  	function time(name, fn) {
  	  var start = _.now();
  	  try {
  	    return fn();
  	  } finally {
  	    console.log(name + " time: " + (_.now() - start) + "ms");
  	  }
  	}

  	function notime(name, fn) {
  	  return fn();
  	}
  	return util$1;
  }

  var normalize;
  var hasRequiredNormalize;

  function requireNormalize () {
  	if (hasRequiredNormalize) return normalize;
  	hasRequiredNormalize = 1;

  	var _ = requireLodash();
  	var util = requireUtil$1();

  	normalize = {
  	  run: run,
  	  undo: undo
  	};

  	/*
  	 * Breaks any long edges in the graph into short segments that span 1 layer
  	 * each. This operation is undoable with the denormalize function.
  	 *
  	 * Pre-conditions:
  	 *
  	 *    1. The input graph is a DAG.
  	 *    2. Each node in the graph has a "rank" property.
  	 *
  	 * Post-condition:
  	 *
  	 *    1. All edges in the graph have a length of 1.
  	 *    2. Dummy nodes are added where edges have been split into segments.
  	 *    3. The graph is augmented with a "dummyChains" attribute which contains
  	 *       the first dummy in each chain of dummy nodes produced.
  	 */
  	function run(g) {
  	  g.graph().dummyChains = [];
  	  _.forEach(g.edges(), function(edge) { normalizeEdge(g, edge); });
  	}

  	function normalizeEdge(g, e) {
  	  var v = e.v;
  	  var vRank = g.node(v).rank;
  	  var w = e.w;
  	  var wRank = g.node(w).rank;
  	  var name = e.name;
  	  var edgeLabel = g.edge(e);
  	  var labelRank = edgeLabel.labelRank;

  	  if (wRank === vRank + 1) return;

  	  g.removeEdge(e);

  	  var dummy, attrs, i;
  	  for (i = 0, ++vRank; vRank < wRank; ++i, ++vRank) {
  	    edgeLabel.points = [];
  	    attrs = {
  	      width: 0, height: 0,
  	      edgeLabel: edgeLabel, edgeObj: e,
  	      rank: vRank
  	    };
  	    dummy = util.addDummyNode(g, "edge", attrs, "_d");
  	    if (vRank === labelRank) {
  	      attrs.width = edgeLabel.width;
  	      attrs.height = edgeLabel.height;
  	      attrs.dummy = "edge-label";
  	      attrs.labelpos = edgeLabel.labelpos;
  	    }
  	    g.setEdge(v, dummy, { weight: edgeLabel.weight }, name);
  	    if (i === 0) {
  	      g.graph().dummyChains.push(dummy);
  	    }
  	    v = dummy;
  	  }

  	  g.setEdge(v, w, { weight: edgeLabel.weight }, name);
  	}

  	function undo(g) {
  	  _.forEach(g.graph().dummyChains, function(v) {
  	    var node = g.node(v);
  	    var origLabel = node.edgeLabel;
  	    var w;
  	    g.setEdge(node.edgeObj, origLabel);
  	    while (node.dummy) {
  	      w = g.successors(v)[0];
  	      g.removeNode(v);
  	      origLabel.points.push({ x: node.x, y: node.y });
  	      if (node.dummy === "edge-label") {
  	        origLabel.x = node.x;
  	        origLabel.y = node.y;
  	        origLabel.width = node.width;
  	        origLabel.height = node.height;
  	      }
  	      v = w;
  	      node = g.node(v);
  	    }
  	  });
  	}
  	return normalize;
  }

  var util;
  var hasRequiredUtil;

  function requireUtil () {
  	if (hasRequiredUtil) return util;
  	hasRequiredUtil = 1;

  	var _ = requireLodash();

  	util = {
  	  longestPath: longestPath,
  	  slack: slack
  	};

  	/*
  	 * Initializes ranks for the input graph using the longest path algorithm. This
  	 * algorithm scales well and is fast in practice, it yields rather poor
  	 * solutions. Nodes are pushed to the lowest layer possible, leaving the bottom
  	 * ranks wide and leaving edges longer than necessary. However, due to its
  	 * speed, this algorithm is good for getting an initial ranking that can be fed
  	 * into other algorithms.
  	 *
  	 * This algorithm does not normalize layers because it will be used by other
  	 * algorithms in most cases. If using this algorithm directly, be sure to
  	 * run normalize at the end.
  	 *
  	 * Pre-conditions:
  	 *
  	 *    1. Input graph is a DAG.
  	 *    2. Input graph node labels can be assigned properties.
  	 *
  	 * Post-conditions:
  	 *
  	 *    1. Each node will be assign an (unnormalized) "rank" property.
  	 */
  	function longestPath(g) {
  	  var visited = {};

  	  function dfs(v) {
  	    var label = g.node(v);
  	    if (_.has(visited, v)) {
  	      return label.rank;
  	    }
  	    visited[v] = true;

  	    var rank = _.min(_.map(g.outEdges(v), function(e) {
  	      return dfs(e.w) - g.edge(e).minlen;
  	    }));

  	    if (rank === Number.POSITIVE_INFINITY || // return value of _.map([]) for Lodash 3
  	        rank === undefined || // return value of _.map([]) for Lodash 4
  	        rank === null) { // return value of _.map([null])
  	      rank = 0;
  	    }

  	    return (label.rank = rank);
  	  }

  	  _.forEach(g.sources(), dfs);
  	}

  	/*
  	 * Returns the amount of slack for the given edge. The slack is defined as the
  	 * difference between the length of the edge and its minimum length.
  	 */
  	function slack(g, e) {
  	  return g.node(e.w).rank - g.node(e.v).rank - g.edge(e).minlen;
  	}
  	return util;
  }

  var feasibleTree_1;
  var hasRequiredFeasibleTree;

  function requireFeasibleTree () {
  	if (hasRequiredFeasibleTree) return feasibleTree_1;
  	hasRequiredFeasibleTree = 1;

  	var _ = requireLodash();
  	var Graph = requireGraphlib().Graph;
  	var slack = requireUtil().slack;

  	feasibleTree_1 = feasibleTree;

  	/*
  	 * Constructs a spanning tree with tight edges and adjusted the input node's
  	 * ranks to achieve this. A tight edge is one that is has a length that matches
  	 * its "minlen" attribute.
  	 *
  	 * The basic structure for this function is derived from Gansner, et al., "A
  	 * Technique for Drawing Directed Graphs."
  	 *
  	 * Pre-conditions:
  	 *
  	 *    1. Graph must be a DAG.
  	 *    2. Graph must be connected.
  	 *    3. Graph must have at least one node.
  	 *    5. Graph nodes must have been previously assigned a "rank" property that
  	 *       respects the "minlen" property of incident edges.
  	 *    6. Graph edges must have a "minlen" property.
  	 *
  	 * Post-conditions:
  	 *
  	 *    - Graph nodes will have their rank adjusted to ensure that all edges are
  	 *      tight.
  	 *
  	 * Returns a tree (undirected graph) that is constructed using only "tight"
  	 * edges.
  	 */
  	function feasibleTree(g) {
  	  var t = new Graph({ directed: false });

  	  // Choose arbitrary node from which to start our tree
  	  var start = g.nodes()[0];
  	  var size = g.nodeCount();
  	  t.setNode(start, {});

  	  var edge, delta;
  	  while (tightTree(t, g) < size) {
  	    edge = findMinSlackEdge(t, g);
  	    delta = t.hasNode(edge.v) ? slack(g, edge) : -slack(g, edge);
  	    shiftRanks(t, g, delta);
  	  }

  	  return t;
  	}

  	/*
  	 * Finds a maximal tree of tight edges and returns the number of nodes in the
  	 * tree.
  	 */
  	function tightTree(t, g) {
  	  function dfs(v) {
  	    _.forEach(g.nodeEdges(v), function(e) {
  	      var edgeV = e.v,
  	        w = (v === edgeV) ? e.w : edgeV;
  	      if (!t.hasNode(w) && !slack(g, e)) {
  	        t.setNode(w, {});
  	        t.setEdge(v, w, {});
  	        dfs(w);
  	      }
  	    });
  	  }

  	  _.forEach(t.nodes(), dfs);
  	  return t.nodeCount();
  	}

  	/*
  	 * Finds the edge with the smallest slack that is incident on tree and returns
  	 * it.
  	 */
  	function findMinSlackEdge(t, g) {
  	  return _.minBy(g.edges(), function(e) {
  	    if (t.hasNode(e.v) !== t.hasNode(e.w)) {
  	      return slack(g, e);
  	    }
  	  });
  	}

  	function shiftRanks(t, g, delta) {
  	  _.forEach(t.nodes(), function(v) {
  	    g.node(v).rank += delta;
  	  });
  	}
  	return feasibleTree_1;
  }

  var networkSimplex_1;
  var hasRequiredNetworkSimplex;

  function requireNetworkSimplex () {
  	if (hasRequiredNetworkSimplex) return networkSimplex_1;
  	hasRequiredNetworkSimplex = 1;

  	var _ = requireLodash();
  	var feasibleTree = requireFeasibleTree();
  	var slack = requireUtil().slack;
  	var initRank = requireUtil().longestPath;
  	var preorder = requireGraphlib().alg.preorder;
  	var postorder = requireGraphlib().alg.postorder;
  	var simplify = requireUtil$1().simplify;

  	networkSimplex_1 = networkSimplex;

  	// Expose some internals for testing purposes
  	networkSimplex.initLowLimValues = initLowLimValues;
  	networkSimplex.initCutValues = initCutValues;
  	networkSimplex.calcCutValue = calcCutValue;
  	networkSimplex.leaveEdge = leaveEdge;
  	networkSimplex.enterEdge = enterEdge;
  	networkSimplex.exchangeEdges = exchangeEdges;

  	/*
  	 * The network simplex algorithm assigns ranks to each node in the input graph
  	 * and iteratively improves the ranking to reduce the length of edges.
  	 *
  	 * Preconditions:
  	 *
  	 *    1. The input graph must be a DAG.
  	 *    2. All nodes in the graph must have an object value.
  	 *    3. All edges in the graph must have "minlen" and "weight" attributes.
  	 *
  	 * Postconditions:
  	 *
  	 *    1. All nodes in the graph will have an assigned "rank" attribute that has
  	 *       been optimized by the network simplex algorithm. Ranks start at 0.
  	 *
  	 *
  	 * A rough sketch of the algorithm is as follows:
  	 *
  	 *    1. Assign initial ranks to each node. We use the longest path algorithm,
  	 *       which assigns ranks to the lowest position possible. In general this
  	 *       leads to very wide bottom ranks and unnecessarily long edges.
  	 *    2. Construct a feasible tight tree. A tight tree is one such that all
  	 *       edges in the tree have no slack (difference between length of edge
  	 *       and minlen for the edge). This by itself greatly improves the assigned
  	 *       rankings by shorting edges.
  	 *    3. Iteratively find edges that have negative cut values. Generally a
  	 *       negative cut value indicates that the edge could be removed and a new
  	 *       tree edge could be added to produce a more compact graph.
  	 *
  	 * Much of the algorithms here are derived from Gansner, et al., "A Technique
  	 * for Drawing Directed Graphs." The structure of the file roughly follows the
  	 * structure of the overall algorithm.
  	 */
  	function networkSimplex(g) {
  	  g = simplify(g);
  	  initRank(g);
  	  var t = feasibleTree(g);
  	  initLowLimValues(t);
  	  initCutValues(t, g);

  	  var e, f;
  	  while ((e = leaveEdge(t))) {
  	    f = enterEdge(t, g, e);
  	    exchangeEdges(t, g, e, f);
  	  }
  	}

  	/*
  	 * Initializes cut values for all edges in the tree.
  	 */
  	function initCutValues(t, g) {
  	  var vs = postorder(t, t.nodes());
  	  vs = vs.slice(0, vs.length - 1);
  	  _.forEach(vs, function(v) {
  	    assignCutValue(t, g, v);
  	  });
  	}

  	function assignCutValue(t, g, child) {
  	  var childLab = t.node(child);
  	  var parent = childLab.parent;
  	  t.edge(child, parent).cutvalue = calcCutValue(t, g, child);
  	}

  	/*
  	 * Given the tight tree, its graph, and a child in the graph calculate and
  	 * return the cut value for the edge between the child and its parent.
  	 */
  	function calcCutValue(t, g, child) {
  	  var childLab = t.node(child);
  	  var parent = childLab.parent;
  	  // True if the child is on the tail end of the edge in the directed graph
  	  var childIsTail = true;
  	  // The graph's view of the tree edge we're inspecting
  	  var graphEdge = g.edge(child, parent);
  	  // The accumulated cut value for the edge between this node and its parent
  	  var cutValue = 0;

  	  if (!graphEdge) {
  	    childIsTail = false;
  	    graphEdge = g.edge(parent, child);
  	  }

  	  cutValue = graphEdge.weight;

  	  _.forEach(g.nodeEdges(child), function(e) {
  	    var isOutEdge = e.v === child,
  	      other = isOutEdge ? e.w : e.v;

  	    if (other !== parent) {
  	      var pointsToHead = isOutEdge === childIsTail,
  	        otherWeight = g.edge(e).weight;

  	      cutValue += pointsToHead ? otherWeight : -otherWeight;
  	      if (isTreeEdge(t, child, other)) {
  	        var otherCutValue = t.edge(child, other).cutvalue;
  	        cutValue += pointsToHead ? -otherCutValue : otherCutValue;
  	      }
  	    }
  	  });

  	  return cutValue;
  	}

  	function initLowLimValues(tree, root) {
  	  if (arguments.length < 2) {
  	    root = tree.nodes()[0];
  	  }
  	  dfsAssignLowLim(tree, {}, 1, root);
  	}

  	function dfsAssignLowLim(tree, visited, nextLim, v, parent) {
  	  var low = nextLim;
  	  var label = tree.node(v);

  	  visited[v] = true;
  	  _.forEach(tree.neighbors(v), function(w) {
  	    if (!_.has(visited, w)) {
  	      nextLim = dfsAssignLowLim(tree, visited, nextLim, w, v);
  	    }
  	  });

  	  label.low = low;
  	  label.lim = nextLim++;
  	  if (parent) {
  	    label.parent = parent;
  	  } else {
  	    // TODO should be able to remove this when we incrementally update low lim
  	    delete label.parent;
  	  }

  	  return nextLim;
  	}

  	function leaveEdge(tree) {
  	  return _.find(tree.edges(), function(e) {
  	    return tree.edge(e).cutvalue < 0;
  	  });
  	}

  	function enterEdge(t, g, edge) {
  	  var v = edge.v;
  	  var w = edge.w;

  	  // For the rest of this function we assume that v is the tail and w is the
  	  // head, so if we don't have this edge in the graph we should flip it to
  	  // match the correct orientation.
  	  if (!g.hasEdge(v, w)) {
  	    v = edge.w;
  	    w = edge.v;
  	  }

  	  var vLabel = t.node(v);
  	  var wLabel = t.node(w);
  	  var tailLabel = vLabel;
  	  var flip = false;

  	  // If the root is in the tail of the edge then we need to flip the logic that
  	  // checks for the head and tail nodes in the candidates function below.
  	  if (vLabel.lim > wLabel.lim) {
  	    tailLabel = wLabel;
  	    flip = true;
  	  }

  	  var candidates = _.filter(g.edges(), function(edge) {
  	    return flip === isDescendant(t, t.node(edge.v), tailLabel) &&
  	           flip !== isDescendant(t, t.node(edge.w), tailLabel);
  	  });

  	  return _.minBy(candidates, function(edge) { return slack(g, edge); });
  	}

  	function exchangeEdges(t, g, e, f) {
  	  var v = e.v;
  	  var w = e.w;
  	  t.removeEdge(v, w);
  	  t.setEdge(f.v, f.w, {});
  	  initLowLimValues(t);
  	  initCutValues(t, g);
  	  updateRanks(t, g);
  	}

  	function updateRanks(t, g) {
  	  var root = _.find(t.nodes(), function(v) { return !g.node(v).parent; });
  	  var vs = preorder(t, root);
  	  vs = vs.slice(1);
  	  _.forEach(vs, function(v) {
  	    var parent = t.node(v).parent,
  	      edge = g.edge(v, parent),
  	      flipped = false;

  	    if (!edge) {
  	      edge = g.edge(parent, v);
  	      flipped = true;
  	    }

  	    g.node(v).rank = g.node(parent).rank + (flipped ? edge.minlen : -edge.minlen);
  	  });
  	}

  	/*
  	 * Returns true if the edge is in the tree.
  	 */
  	function isTreeEdge(tree, u, v) {
  	  return tree.hasEdge(u, v);
  	}

  	/*
  	 * Returns true if the specified node is descendant of the root node per the
  	 * assigned low and lim attributes in the tree.
  	 */
  	function isDescendant(tree, vLabel, rootLabel) {
  	  return rootLabel.low <= vLabel.lim && vLabel.lim <= rootLabel.lim;
  	}
  	return networkSimplex_1;
  }

  var rank_1;
  var hasRequiredRank;

  function requireRank () {
  	if (hasRequiredRank) return rank_1;
  	hasRequiredRank = 1;

  	var rankUtil = requireUtil();
  	var longestPath = rankUtil.longestPath;
  	var feasibleTree = requireFeasibleTree();
  	var networkSimplex = requireNetworkSimplex();

  	rank_1 = rank;

  	/*
  	 * Assigns a rank to each node in the input graph that respects the "minlen"
  	 * constraint specified on edges between nodes.
  	 *
  	 * This basic structure is derived from Gansner, et al., "A Technique for
  	 * Drawing Directed Graphs."
  	 *
  	 * Pre-conditions:
  	 *
  	 *    1. Graph must be a connected DAG
  	 *    2. Graph nodes must be objects
  	 *    3. Graph edges must have "weight" and "minlen" attributes
  	 *
  	 * Post-conditions:
  	 *
  	 *    1. Graph nodes will have a "rank" attribute based on the results of the
  	 *       algorithm. Ranks can start at any index (including negative), we'll
  	 *       fix them up later.
  	 */
  	function rank(g) {
  	  switch(g.graph().ranker) {
  	  case "network-simplex": networkSimplexRanker(g); break;
  	  case "tight-tree": tightTreeRanker(g); break;
  	  case "longest-path": longestPathRanker(g); break;
  	  default: networkSimplexRanker(g);
  	  }
  	}

  	// A fast and simple ranker, but results are far from optimal.
  	var longestPathRanker = longestPath;

  	function tightTreeRanker(g) {
  	  longestPath(g);
  	  feasibleTree(g);
  	}

  	function networkSimplexRanker(g) {
  	  networkSimplex(g);
  	}
  	return rank_1;
  }

  var parentDummyChains_1;
  var hasRequiredParentDummyChains;

  function requireParentDummyChains () {
  	if (hasRequiredParentDummyChains) return parentDummyChains_1;
  	hasRequiredParentDummyChains = 1;
  	var _ = requireLodash();

  	parentDummyChains_1 = parentDummyChains;

  	function parentDummyChains(g) {
  	  var postorderNums = postorder(g);

  	  _.forEach(g.graph().dummyChains, function(v) {
  	    var node = g.node(v);
  	    var edgeObj = node.edgeObj;
  	    var pathData = findPath(g, postorderNums, edgeObj.v, edgeObj.w);
  	    var path = pathData.path;
  	    var lca = pathData.lca;
  	    var pathIdx = 0;
  	    var pathV = path[pathIdx];
  	    var ascending = true;

  	    while (v !== edgeObj.w) {
  	      node = g.node(v);

  	      if (ascending) {
  	        while ((pathV = path[pathIdx]) !== lca &&
  	               g.node(pathV).maxRank < node.rank) {
  	          pathIdx++;
  	        }

  	        if (pathV === lca) {
  	          ascending = false;
  	        }
  	      }

  	      if (!ascending) {
  	        while (pathIdx < path.length - 1 &&
  	               g.node(pathV = path[pathIdx + 1]).minRank <= node.rank) {
  	          pathIdx++;
  	        }
  	        pathV = path[pathIdx];
  	      }

  	      g.setParent(v, pathV);
  	      v = g.successors(v)[0];
  	    }
  	  });
  	}

  	// Find a path from v to w through the lowest common ancestor (LCA). Return the
  	// full path and the LCA.
  	function findPath(g, postorderNums, v, w) {
  	  var vPath = [];
  	  var wPath = [];
  	  var low = Math.min(postorderNums[v].low, postorderNums[w].low);
  	  var lim = Math.max(postorderNums[v].lim, postorderNums[w].lim);
  	  var parent;
  	  var lca;

  	  // Traverse up from v to find the LCA
  	  parent = v;
  	  do {
  	    parent = g.parent(parent);
  	    vPath.push(parent);
  	  } while (parent &&
  	           (postorderNums[parent].low > low || lim > postorderNums[parent].lim));
  	  lca = parent;

  	  // Traverse from w to LCA
  	  parent = w;
  	  while ((parent = g.parent(parent)) !== lca) {
  	    wPath.push(parent);
  	  }

  	  return { path: vPath.concat(wPath.reverse()), lca: lca };
  	}

  	function postorder(g) {
  	  var result = {};
  	  var lim = 0;

  	  function dfs(v) {
  	    var low = lim;
  	    _.forEach(g.children(v), dfs);
  	    result[v] = { low: low, lim: lim++ };
  	  }
  	  _.forEach(g.children(), dfs);

  	  return result;
  	}
  	return parentDummyChains_1;
  }

  var nestingGraph;
  var hasRequiredNestingGraph;

  function requireNestingGraph () {
  	if (hasRequiredNestingGraph) return nestingGraph;
  	hasRequiredNestingGraph = 1;
  	var _ = requireLodash();
  	var util = requireUtil$1();

  	nestingGraph = {
  	  run: run,
  	  cleanup: cleanup
  	};

  	/*
  	 * A nesting graph creates dummy nodes for the tops and bottoms of subgraphs,
  	 * adds appropriate edges to ensure that all cluster nodes are placed between
  	 * these boundries, and ensures that the graph is connected.
  	 *
  	 * In addition we ensure, through the use of the minlen property, that nodes
  	 * and subgraph border nodes to not end up on the same rank.
  	 *
  	 * Preconditions:
  	 *
  	 *    1. Input graph is a DAG
  	 *    2. Nodes in the input graph has a minlen attribute
  	 *
  	 * Postconditions:
  	 *
  	 *    1. Input graph is connected.
  	 *    2. Dummy nodes are added for the tops and bottoms of subgraphs.
  	 *    3. The minlen attribute for nodes is adjusted to ensure nodes do not
  	 *       get placed on the same rank as subgraph border nodes.
  	 *
  	 * The nesting graph idea comes from Sander, "Layout of Compound Directed
  	 * Graphs."
  	 */
  	function run(g) {
  	  var root = util.addDummyNode(g, "root", {}, "_root");
  	  var depths = treeDepths(g);
  	  var height = _.max(_.values(depths)) - 1; // Note: depths is an Object not an array
  	  var nodeSep = 2 * height + 1;

  	  g.graph().nestingRoot = root;

  	  // Multiply minlen by nodeSep to align nodes on non-border ranks.
  	  _.forEach(g.edges(), function(e) { g.edge(e).minlen *= nodeSep; });

  	  // Calculate a weight that is sufficient to keep subgraphs vertically compact
  	  var weight = sumWeights(g) + 1;

  	  // Create border nodes and link them up
  	  _.forEach(g.children(), function(child) {
  	    dfs(g, root, nodeSep, weight, height, depths, child);
  	  });

  	  // Save the multiplier for node layers for later removal of empty border
  	  // layers.
  	  g.graph().nodeRankFactor = nodeSep;
  	}

  	function dfs(g, root, nodeSep, weight, height, depths, v) {
  	  var children = g.children(v);
  	  if (!children.length) {
  	    if (v !== root) {
  	      g.setEdge(root, v, { weight: 0, minlen: nodeSep });
  	    }
  	    return;
  	  }

  	  var top = util.addBorderNode(g, "_bt");
  	  var bottom = util.addBorderNode(g, "_bb");
  	  var label = g.node(v);

  	  g.setParent(top, v);
  	  label.borderTop = top;
  	  g.setParent(bottom, v);
  	  label.borderBottom = bottom;

  	  _.forEach(children, function(child) {
  	    dfs(g, root, nodeSep, weight, height, depths, child);

  	    var childNode = g.node(child);
  	    var childTop = childNode.borderTop ? childNode.borderTop : child;
  	    var childBottom = childNode.borderBottom ? childNode.borderBottom : child;
  	    var thisWeight = childNode.borderTop ? weight : 2 * weight;
  	    var minlen = childTop !== childBottom ? 1 : height - depths[v] + 1;

  	    g.setEdge(top, childTop, {
  	      weight: thisWeight,
  	      minlen: minlen,
  	      nestingEdge: true
  	    });

  	    g.setEdge(childBottom, bottom, {
  	      weight: thisWeight,
  	      minlen: minlen,
  	      nestingEdge: true
  	    });
  	  });

  	  if (!g.parent(v)) {
  	    g.setEdge(root, top, { weight: 0, minlen: height + depths[v] });
  	  }
  	}

  	function treeDepths(g) {
  	  var depths = {};
  	  function dfs(v, depth) {
  	    var children = g.children(v);
  	    if (children && children.length) {
  	      _.forEach(children, function(child) {
  	        dfs(child, depth + 1);
  	      });
  	    }
  	    depths[v] = depth;
  	  }
  	  _.forEach(g.children(), function(v) { dfs(v, 1); });
  	  return depths;
  	}

  	function sumWeights(g) {
  	  return _.reduce(g.edges(), function(acc, e) {
  	    return acc + g.edge(e).weight;
  	  }, 0);
  	}

  	function cleanup(g) {
  	  var graphLabel = g.graph();
  	  g.removeNode(graphLabel.nestingRoot);
  	  delete graphLabel.nestingRoot;
  	  _.forEach(g.edges(), function(e) {
  	    var edge = g.edge(e);
  	    if (edge.nestingEdge) {
  	      g.removeEdge(e);
  	    }
  	  });
  	}
  	return nestingGraph;
  }

  var addBorderSegments_1;
  var hasRequiredAddBorderSegments;

  function requireAddBorderSegments () {
  	if (hasRequiredAddBorderSegments) return addBorderSegments_1;
  	hasRequiredAddBorderSegments = 1;
  	var _ = requireLodash();
  	var util = requireUtil$1();

  	addBorderSegments_1 = addBorderSegments;

  	function addBorderSegments(g) {
  	  function dfs(v) {
  	    var children = g.children(v);
  	    var node = g.node(v);
  	    if (children.length) {
  	      _.forEach(children, dfs);
  	    }

  	    if (_.has(node, "minRank")) {
  	      node.borderLeft = [];
  	      node.borderRight = [];
  	      for (var rank = node.minRank, maxRank = node.maxRank + 1;
  	        rank < maxRank;
  	        ++rank) {
  	        addBorderNode(g, "borderLeft", "_bl", v, node, rank);
  	        addBorderNode(g, "borderRight", "_br", v, node, rank);
  	      }
  	    }
  	  }

  	  _.forEach(g.children(), dfs);
  	}

  	function addBorderNode(g, prop, prefix, sg, sgNode, rank) {
  	  var label = { width: 0, height: 0, rank: rank, borderType: prop };
  	  var prev = sgNode[prop][rank - 1];
  	  var curr = util.addDummyNode(g, "border", label, prefix);
  	  sgNode[prop][rank] = curr;
  	  g.setParent(curr, sg);
  	  if (prev) {
  	    g.setEdge(prev, curr, { weight: 1 });
  	  }
  	}
  	return addBorderSegments_1;
  }

  var coordinateSystem;
  var hasRequiredCoordinateSystem;

  function requireCoordinateSystem () {
  	if (hasRequiredCoordinateSystem) return coordinateSystem;
  	hasRequiredCoordinateSystem = 1;

  	var _ = requireLodash();

  	coordinateSystem = {
  	  adjust: adjust,
  	  undo: undo
  	};

  	function adjust(g) {
  	  var rankDir = g.graph().rankdir.toLowerCase();
  	  if (rankDir === "lr" || rankDir === "rl") {
  	    swapWidthHeight(g);
  	  }
  	}

  	function undo(g) {
  	  var rankDir = g.graph().rankdir.toLowerCase();
  	  if (rankDir === "bt" || rankDir === "rl") {
  	    reverseY(g);
  	  }

  	  if (rankDir === "lr" || rankDir === "rl") {
  	    swapXY(g);
  	    swapWidthHeight(g);
  	  }
  	}

  	function swapWidthHeight(g) {
  	  _.forEach(g.nodes(), function(v) { swapWidthHeightOne(g.node(v)); });
  	  _.forEach(g.edges(), function(e) { swapWidthHeightOne(g.edge(e)); });
  	}

  	function swapWidthHeightOne(attrs) {
  	  var w = attrs.width;
  	  attrs.width = attrs.height;
  	  attrs.height = w;
  	}

  	function reverseY(g) {
  	  _.forEach(g.nodes(), function(v) { reverseYOne(g.node(v)); });

  	  _.forEach(g.edges(), function(e) {
  	    var edge = g.edge(e);
  	    _.forEach(edge.points, reverseYOne);
  	    if (_.has(edge, "y")) {
  	      reverseYOne(edge);
  	    }
  	  });
  	}

  	function reverseYOne(attrs) {
  	  attrs.y = -attrs.y;
  	}

  	function swapXY(g) {
  	  _.forEach(g.nodes(), function(v) { swapXYOne(g.node(v)); });

  	  _.forEach(g.edges(), function(e) {
  	    var edge = g.edge(e);
  	    _.forEach(edge.points, swapXYOne);
  	    if (_.has(edge, "x")) {
  	      swapXYOne(edge);
  	    }
  	  });
  	}

  	function swapXYOne(attrs) {
  	  var x = attrs.x;
  	  attrs.x = attrs.y;
  	  attrs.y = x;
  	}
  	return coordinateSystem;
  }

  var initOrder_1;
  var hasRequiredInitOrder;

  function requireInitOrder () {
  	if (hasRequiredInitOrder) return initOrder_1;
  	hasRequiredInitOrder = 1;

  	var _ = requireLodash();

  	initOrder_1 = initOrder;

  	/*
  	 * Assigns an initial order value for each node by performing a DFS search
  	 * starting from nodes in the first rank. Nodes are assigned an order in their
  	 * rank as they are first visited.
  	 *
  	 * This approach comes from Gansner, et al., "A Technique for Drawing Directed
  	 * Graphs."
  	 *
  	 * Returns a layering matrix with an array per layer and each layer sorted by
  	 * the order of its nodes.
  	 */
  	function initOrder(g) {
  	  var visited = {};
  	  var simpleNodes = _.filter(g.nodes(), function(v) {
  	    return !g.children(v).length;
  	  });
  	  var maxRank = _.max(_.map(simpleNodes, function(v) { return g.node(v).rank; }));
  	  var layers = _.map(_.range(maxRank + 1), function() { return []; });

  	  function dfs(v) {
  	    if (_.has(visited, v)) return;
  	    visited[v] = true;
  	    var node = g.node(v);
  	    layers[node.rank].push(v);
  	    _.forEach(g.successors(v), dfs);
  	  }

  	  var orderedVs = _.sortBy(simpleNodes, function(v) { return g.node(v).rank; });
  	  _.forEach(orderedVs, dfs);

  	  return layers;
  	}
  	return initOrder_1;
  }

  var crossCount_1;
  var hasRequiredCrossCount;

  function requireCrossCount () {
  	if (hasRequiredCrossCount) return crossCount_1;
  	hasRequiredCrossCount = 1;

  	var _ = requireLodash();

  	crossCount_1 = crossCount;

  	/*
  	 * A function that takes a layering (an array of layers, each with an array of
  	 * ordererd nodes) and a graph and returns a weighted crossing count.
  	 *
  	 * Pre-conditions:
  	 *
  	 *    1. Input graph must be simple (not a multigraph), directed, and include
  	 *       only simple edges.
  	 *    2. Edges in the input graph must have assigned weights.
  	 *
  	 * Post-conditions:
  	 *
  	 *    1. The graph and layering matrix are left unchanged.
  	 *
  	 * This algorithm is derived from Barth, et al., "Bilayer Cross Counting."
  	 */
  	function crossCount(g, layering) {
  	  var cc = 0;
  	  for (var i = 1; i < layering.length; ++i) {
  	    cc += twoLayerCrossCount(g, layering[i-1], layering[i]);
  	  }
  	  return cc;
  	}

  	function twoLayerCrossCount(g, northLayer, southLayer) {
  	  // Sort all of the edges between the north and south layers by their position
  	  // in the north layer and then the south. Map these edges to the position of
  	  // their head in the south layer.
  	  var southPos = _.zipObject(southLayer,
  	    _.map(southLayer, function (v, i) { return i; }));
  	  var southEntries = _.flatten(_.map(northLayer, function(v) {
  	    return _.sortBy(_.map(g.outEdges(v), function(e) {
  	      return { pos: southPos[e.w], weight: g.edge(e).weight };
  	    }), "pos");
  	  }), true);

  	  // Build the accumulator tree
  	  var firstIndex = 1;
  	  while (firstIndex < southLayer.length) firstIndex <<= 1;
  	  var treeSize = 2 * firstIndex - 1;
  	  firstIndex -= 1;
  	  var tree = _.map(new Array(treeSize), function() { return 0; });

  	  // Calculate the weighted crossings
  	  var cc = 0;
  	  _.forEach(southEntries.forEach(function(entry) {
  	    var index = entry.pos + firstIndex;
  	    tree[index] += entry.weight;
  	    var weightSum = 0;
  	    while (index > 0) {
  	      if (index % 2) {
  	        weightSum += tree[index + 1];
  	      }
  	      index = (index - 1) >> 1;
  	      tree[index] += entry.weight;
  	    }
  	    cc += entry.weight * weightSum;
  	  }));

  	  return cc;
  	}
  	return crossCount_1;
  }

  var barycenter_1;
  var hasRequiredBarycenter;

  function requireBarycenter () {
  	if (hasRequiredBarycenter) return barycenter_1;
  	hasRequiredBarycenter = 1;
  	var _ = requireLodash();

  	barycenter_1 = barycenter;

  	function barycenter(g, movable) {
  	  return _.map(movable, function(v) {
  	    var inV = g.inEdges(v);
  	    if (!inV.length) {
  	      return { v: v };
  	    } else {
  	      var result = _.reduce(inV, function(acc, e) {
  	        var edge = g.edge(e),
  	          nodeU = g.node(e.v);
  	        return {
  	          sum: acc.sum + (edge.weight * nodeU.order),
  	          weight: acc.weight + edge.weight
  	        };
  	      }, { sum: 0, weight: 0 });

  	      return {
  	        v: v,
  	        barycenter: result.sum / result.weight,
  	        weight: result.weight
  	      };
  	    }
  	  });
  	}
  	return barycenter_1;
  }

  var resolveConflicts_1;
  var hasRequiredResolveConflicts;

  function requireResolveConflicts () {
  	if (hasRequiredResolveConflicts) return resolveConflicts_1;
  	hasRequiredResolveConflicts = 1;

  	var _ = requireLodash();

  	resolveConflicts_1 = resolveConflicts;

  	/*
  	 * Given a list of entries of the form {v, barycenter, weight} and a
  	 * constraint graph this function will resolve any conflicts between the
  	 * constraint graph and the barycenters for the entries. If the barycenters for
  	 * an entry would violate a constraint in the constraint graph then we coalesce
  	 * the nodes in the conflict into a new node that respects the contraint and
  	 * aggregates barycenter and weight information.
  	 *
  	 * This implementation is based on the description in Forster, "A Fast and
  	 * Simple Hueristic for Constrained Two-Level Crossing Reduction," thought it
  	 * differs in some specific details.
  	 *
  	 * Pre-conditions:
  	 *
  	 *    1. Each entry has the form {v, barycenter, weight}, or if the node has
  	 *       no barycenter, then {v}.
  	 *
  	 * Returns:
  	 *
  	 *    A new list of entries of the form {vs, i, barycenter, weight}. The list
  	 *    `vs` may either be a singleton or it may be an aggregation of nodes
  	 *    ordered such that they do not violate constraints from the constraint
  	 *    graph. The property `i` is the lowest original index of any of the
  	 *    elements in `vs`.
  	 */
  	function resolveConflicts(entries, cg) {
  	  var mappedEntries = {};
  	  _.forEach(entries, function(entry, i) {
  	    var tmp = mappedEntries[entry.v] = {
  	      indegree: 0,
  	      "in": [],
  	      out: [],
  	      vs: [entry.v],
  	      i: i
  	    };
  	    if (!_.isUndefined(entry.barycenter)) {
  	      tmp.barycenter = entry.barycenter;
  	      tmp.weight = entry.weight;
  	    }
  	  });

  	  _.forEach(cg.edges(), function(e) {
  	    var entryV = mappedEntries[e.v];
  	    var entryW = mappedEntries[e.w];
  	    if (!_.isUndefined(entryV) && !_.isUndefined(entryW)) {
  	      entryW.indegree++;
  	      entryV.out.push(mappedEntries[e.w]);
  	    }
  	  });

  	  var sourceSet = _.filter(mappedEntries, function(entry) {
  	    return !entry.indegree;
  	  });

  	  return doResolveConflicts(sourceSet);
  	}

  	function doResolveConflicts(sourceSet) {
  	  var entries = [];

  	  function handleIn(vEntry) {
  	    return function(uEntry) {
  	      if (uEntry.merged) {
  	        return;
  	      }
  	      if (_.isUndefined(uEntry.barycenter) ||
  	          _.isUndefined(vEntry.barycenter) ||
  	          uEntry.barycenter >= vEntry.barycenter) {
  	        mergeEntries(vEntry, uEntry);
  	      }
  	    };
  	  }

  	  function handleOut(vEntry) {
  	    return function(wEntry) {
  	      wEntry["in"].push(vEntry);
  	      if (--wEntry.indegree === 0) {
  	        sourceSet.push(wEntry);
  	      }
  	    };
  	  }

  	  while (sourceSet.length) {
  	    var entry = sourceSet.pop();
  	    entries.push(entry);
  	    _.forEach(entry["in"].reverse(), handleIn(entry));
  	    _.forEach(entry.out, handleOut(entry));
  	  }

  	  return _.map(_.filter(entries, function(entry) { return !entry.merged; }),
  	    function(entry) {
  	      return _.pick(entry, ["vs", "i", "barycenter", "weight"]);
  	    });

  	}

  	function mergeEntries(target, source) {
  	  var sum = 0;
  	  var weight = 0;

  	  if (target.weight) {
  	    sum += target.barycenter * target.weight;
  	    weight += target.weight;
  	  }

  	  if (source.weight) {
  	    sum += source.barycenter * source.weight;
  	    weight += source.weight;
  	  }

  	  target.vs = source.vs.concat(target.vs);
  	  target.barycenter = sum / weight;
  	  target.weight = weight;
  	  target.i = Math.min(source.i, target.i);
  	  source.merged = true;
  	}
  	return resolveConflicts_1;
  }

  var sort_1;
  var hasRequiredSort;

  function requireSort () {
  	if (hasRequiredSort) return sort_1;
  	hasRequiredSort = 1;
  	var _ = requireLodash();
  	var util = requireUtil$1();

  	sort_1 = sort;

  	function sort(entries, biasRight) {
  	  var parts = util.partition(entries, function(entry) {
  	    return _.has(entry, "barycenter");
  	  });
  	  var sortable = parts.lhs,
  	    unsortable = _.sortBy(parts.rhs, function(entry) { return -entry.i; }),
  	    vs = [],
  	    sum = 0,
  	    weight = 0,
  	    vsIndex = 0;

  	  sortable.sort(compareWithBias(!!biasRight));

  	  vsIndex = consumeUnsortable(vs, unsortable, vsIndex);

  	  _.forEach(sortable, function (entry) {
  	    vsIndex += entry.vs.length;
  	    vs.push(entry.vs);
  	    sum += entry.barycenter * entry.weight;
  	    weight += entry.weight;
  	    vsIndex = consumeUnsortable(vs, unsortable, vsIndex);
  	  });

  	  var result = { vs: _.flatten(vs, true) };
  	  if (weight) {
  	    result.barycenter = sum / weight;
  	    result.weight = weight;
  	  }
  	  return result;
  	}

  	function consumeUnsortable(vs, unsortable, index) {
  	  var last;
  	  while (unsortable.length && (last = _.last(unsortable)).i <= index) {
  	    unsortable.pop();
  	    vs.push(last.vs);
  	    index++;
  	  }
  	  return index;
  	}

  	function compareWithBias(bias) {
  	  return function(entryV, entryW) {
  	    if (entryV.barycenter < entryW.barycenter) {
  	      return -1;
  	    } else if (entryV.barycenter > entryW.barycenter) {
  	      return 1;
  	    }

  	    return !bias ? entryV.i - entryW.i : entryW.i - entryV.i;
  	  };
  	}
  	return sort_1;
  }

  var sortSubgraph_1;
  var hasRequiredSortSubgraph;

  function requireSortSubgraph () {
  	if (hasRequiredSortSubgraph) return sortSubgraph_1;
  	hasRequiredSortSubgraph = 1;
  	var _ = requireLodash();
  	var barycenter = requireBarycenter();
  	var resolveConflicts = requireResolveConflicts();
  	var sort = requireSort();

  	sortSubgraph_1 = sortSubgraph;

  	function sortSubgraph(g, v, cg, biasRight) {
  	  var movable = g.children(v);
  	  var node = g.node(v);
  	  var bl = node ? node.borderLeft : undefined;
  	  var br = node ? node.borderRight: undefined;
  	  var subgraphs = {};

  	  if (bl) {
  	    movable = _.filter(movable, function(w) {
  	      return w !== bl && w !== br;
  	    });
  	  }

  	  var barycenters = barycenter(g, movable);
  	  _.forEach(barycenters, function(entry) {
  	    if (g.children(entry.v).length) {
  	      var subgraphResult = sortSubgraph(g, entry.v, cg, biasRight);
  	      subgraphs[entry.v] = subgraphResult;
  	      if (_.has(subgraphResult, "barycenter")) {
  	        mergeBarycenters(entry, subgraphResult);
  	      }
  	    }
  	  });

  	  var entries = resolveConflicts(barycenters, cg);
  	  expandSubgraphs(entries, subgraphs);

  	  var result = sort(entries, biasRight);

  	  if (bl) {
  	    result.vs = _.flatten([bl, result.vs, br], true);
  	    if (g.predecessors(bl).length) {
  	      var blPred = g.node(g.predecessors(bl)[0]),
  	        brPred = g.node(g.predecessors(br)[0]);
  	      if (!_.has(result, "barycenter")) {
  	        result.barycenter = 0;
  	        result.weight = 0;
  	      }
  	      result.barycenter = (result.barycenter * result.weight +
  	                           blPred.order + brPred.order) / (result.weight + 2);
  	      result.weight += 2;
  	    }
  	  }

  	  return result;
  	}

  	function expandSubgraphs(entries, subgraphs) {
  	  _.forEach(entries, function(entry) {
  	    entry.vs = _.flatten(entry.vs.map(function(v) {
  	      if (subgraphs[v]) {
  	        return subgraphs[v].vs;
  	      }
  	      return v;
  	    }), true);
  	  });
  	}

  	function mergeBarycenters(target, other) {
  	  if (!_.isUndefined(target.barycenter)) {
  	    target.barycenter = (target.barycenter * target.weight +
  	                         other.barycenter * other.weight) /
  	                        (target.weight + other.weight);
  	    target.weight += other.weight;
  	  } else {
  	    target.barycenter = other.barycenter;
  	    target.weight = other.weight;
  	  }
  	}
  	return sortSubgraph_1;
  }

  var buildLayerGraph_1;
  var hasRequiredBuildLayerGraph;

  function requireBuildLayerGraph () {
  	if (hasRequiredBuildLayerGraph) return buildLayerGraph_1;
  	hasRequiredBuildLayerGraph = 1;
  	var _ = requireLodash();
  	var Graph = requireGraphlib().Graph;

  	buildLayerGraph_1 = buildLayerGraph;

  	/*
  	 * Constructs a graph that can be used to sort a layer of nodes. The graph will
  	 * contain all base and subgraph nodes from the request layer in their original
  	 * hierarchy and any edges that are incident on these nodes and are of the type
  	 * requested by the "relationship" parameter.
  	 *
  	 * Nodes from the requested rank that do not have parents are assigned a root
  	 * node in the output graph, which is set in the root graph attribute. This
  	 * makes it easy to walk the hierarchy of movable nodes during ordering.
  	 *
  	 * Pre-conditions:
  	 *
  	 *    1. Input graph is a DAG
  	 *    2. Base nodes in the input graph have a rank attribute
  	 *    3. Subgraph nodes in the input graph has minRank and maxRank attributes
  	 *    4. Edges have an assigned weight
  	 *
  	 * Post-conditions:
  	 *
  	 *    1. Output graph has all nodes in the movable rank with preserved
  	 *       hierarchy.
  	 *    2. Root nodes in the movable layer are made children of the node
  	 *       indicated by the root attribute of the graph.
  	 *    3. Non-movable nodes incident on movable nodes, selected by the
  	 *       relationship parameter, are included in the graph (without hierarchy).
  	 *    4. Edges incident on movable nodes, selected by the relationship
  	 *       parameter, are added to the output graph.
  	 *    5. The weights for copied edges are aggregated as need, since the output
  	 *       graph is not a multi-graph.
  	 */
  	function buildLayerGraph(g, rank, relationship) {
  	  var root = createRootNode(g),
  	    result = new Graph({ compound: true }).setGraph({ root: root })
  	      .setDefaultNodeLabel(function(v) { return g.node(v); });

  	  _.forEach(g.nodes(), function(v) {
  	    var node = g.node(v),
  	      parent = g.parent(v);

  	    if (node.rank === rank || node.minRank <= rank && rank <= node.maxRank) {
  	      result.setNode(v);
  	      result.setParent(v, parent || root);

  	      // This assumes we have only short edges!
  	      _.forEach(g[relationship](v), function(e) {
  	        var u = e.v === v ? e.w : e.v,
  	          edge = result.edge(u, v),
  	          weight = !_.isUndefined(edge) ? edge.weight : 0;
  	        result.setEdge(u, v, { weight: g.edge(e).weight + weight });
  	      });

  	      if (_.has(node, "minRank")) {
  	        result.setNode(v, {
  	          borderLeft: node.borderLeft[rank],
  	          borderRight: node.borderRight[rank]
  	        });
  	      }
  	    }
  	  });

  	  return result;
  	}

  	function createRootNode(g) {
  	  var v;
  	  while (g.hasNode((v = _.uniqueId("_root"))));
  	  return v;
  	}
  	return buildLayerGraph_1;
  }

  var addSubgraphConstraints_1;
  var hasRequiredAddSubgraphConstraints;

  function requireAddSubgraphConstraints () {
  	if (hasRequiredAddSubgraphConstraints) return addSubgraphConstraints_1;
  	hasRequiredAddSubgraphConstraints = 1;
  	var _ = requireLodash();

  	addSubgraphConstraints_1 = addSubgraphConstraints;

  	function addSubgraphConstraints(g, cg, vs) {
  	  var prev = {},
  	    rootPrev;

  	  _.forEach(vs, function(v) {
  	    var child = g.parent(v),
  	      parent,
  	      prevChild;
  	    while (child) {
  	      parent = g.parent(child);
  	      if (parent) {
  	        prevChild = prev[parent];
  	        prev[parent] = child;
  	      } else {
  	        prevChild = rootPrev;
  	        rootPrev = child;
  	      }
  	      if (prevChild && prevChild !== child) {
  	        cg.setEdge(prevChild, child);
  	        return;
  	      }
  	      child = parent;
  	    }
  	  });

  	  /*
  	  function dfs(v) {
  	    var children = v ? g.children(v) : g.children();
  	    if (children.length) {
  	      var min = Number.POSITIVE_INFINITY,
  	          subgraphs = [];
  	      _.each(children, function(child) {
  	        var childMin = dfs(child);
  	        if (g.children(child).length) {
  	          subgraphs.push({ v: child, order: childMin });
  	        }
  	        min = Math.min(min, childMin);
  	      });
  	      _.reduce(_.sortBy(subgraphs, "order"), function(prev, curr) {
  	        cg.setEdge(prev.v, curr.v);
  	        return curr;
  	      });
  	      return min;
  	    }
  	    return g.node(v).order;
  	  }
  	  dfs(undefined);
  	  */
  	}
  	return addSubgraphConstraints_1;
  }

  var order_1;
  var hasRequiredOrder;

  function requireOrder () {
  	if (hasRequiredOrder) return order_1;
  	hasRequiredOrder = 1;

  	var _ = requireLodash();
  	var initOrder = requireInitOrder();
  	var crossCount = requireCrossCount();
  	var sortSubgraph = requireSortSubgraph();
  	var buildLayerGraph = requireBuildLayerGraph();
  	var addSubgraphConstraints = requireAddSubgraphConstraints();
  	var Graph = requireGraphlib().Graph;
  	var util = requireUtil$1();

  	order_1 = order;

  	/*
  	 * Applies heuristics to minimize edge crossings in the graph and sets the best
  	 * order solution as an order attribute on each node.
  	 *
  	 * Pre-conditions:
  	 *
  	 *    1. Graph must be DAG
  	 *    2. Graph nodes must be objects with a "rank" attribute
  	 *    3. Graph edges must have the "weight" attribute
  	 *
  	 * Post-conditions:
  	 *
  	 *    1. Graph nodes will have an "order" attribute based on the results of the
  	 *       algorithm.
  	 */
  	function order(g) {
  	  var maxRank = util.maxRank(g),
  	    downLayerGraphs = buildLayerGraphs(g, _.range(1, maxRank + 1), "inEdges"),
  	    upLayerGraphs = buildLayerGraphs(g, _.range(maxRank - 1, -1, -1), "outEdges");

  	  var layering = initOrder(g);
  	  assignOrder(g, layering);

  	  var bestCC = Number.POSITIVE_INFINITY,
  	    best;

  	  for (var i = 0, lastBest = 0; lastBest < 4; ++i, ++lastBest) {
  	    sweepLayerGraphs(i % 2 ? downLayerGraphs : upLayerGraphs, i % 4 >= 2);

  	    layering = util.buildLayerMatrix(g);
  	    var cc = crossCount(g, layering);
  	    if (cc < bestCC) {
  	      lastBest = 0;
  	      best = _.cloneDeep(layering);
  	      bestCC = cc;
  	    }
  	  }

  	  assignOrder(g, best);
  	}

  	function buildLayerGraphs(g, ranks, relationship) {
  	  return _.map(ranks, function(rank) {
  	    return buildLayerGraph(g, rank, relationship);
  	  });
  	}

  	function sweepLayerGraphs(layerGraphs, biasRight) {
  	  var cg = new Graph();
  	  _.forEach(layerGraphs, function(lg) {
  	    var root = lg.graph().root;
  	    var sorted = sortSubgraph(lg, root, cg, biasRight);
  	    _.forEach(sorted.vs, function(v, i) {
  	      lg.node(v).order = i;
  	    });
  	    addSubgraphConstraints(lg, cg, sorted.vs);
  	  });
  	}

  	function assignOrder(g, layering) {
  	  _.forEach(layering, function(layer) {
  	    _.forEach(layer, function(v, i) {
  	      g.node(v).order = i;
  	    });
  	  });
  	}
  	return order_1;
  }

  var bk;
  var hasRequiredBk;

  function requireBk () {
  	if (hasRequiredBk) return bk;
  	hasRequiredBk = 1;

  	var _ = requireLodash();
  	var Graph = requireGraphlib().Graph;
  	var util = requireUtil$1();

  	/*
  	 * This module provides coordinate assignment based on Brandes and Köpf, "Fast
  	 * and Simple Horizontal Coordinate Assignment."
  	 */

  	bk = {
  	  positionX: positionX,
  	  findType1Conflicts: findType1Conflicts,
  	  findType2Conflicts: findType2Conflicts,
  	  addConflict: addConflict,
  	  hasConflict: hasConflict,
  	  verticalAlignment: verticalAlignment,
  	  horizontalCompaction: horizontalCompaction,
  	  alignCoordinates: alignCoordinates,
  	  findSmallestWidthAlignment: findSmallestWidthAlignment,
  	  balance: balance
  	};

  	/*
  	 * Marks all edges in the graph with a type-1 conflict with the "type1Conflict"
  	 * property. A type-1 conflict is one where a non-inner segment crosses an
  	 * inner segment. An inner segment is an edge with both incident nodes marked
  	 * with the "dummy" property.
  	 *
  	 * This algorithm scans layer by layer, starting with the second, for type-1
  	 * conflicts between the current layer and the previous layer. For each layer
  	 * it scans the nodes from left to right until it reaches one that is incident
  	 * on an inner segment. It then scans predecessors to determine if they have
  	 * edges that cross that inner segment. At the end a final scan is done for all
  	 * nodes on the current rank to see if they cross the last visited inner
  	 * segment.
  	 *
  	 * This algorithm (safely) assumes that a dummy node will only be incident on a
  	 * single node in the layers being scanned.
  	 */
  	function findType1Conflicts(g, layering) {
  	  var conflicts = {};

  	  function visitLayer(prevLayer, layer) {
  	    var
  	      // last visited node in the previous layer that is incident on an inner
  	      // segment.
  	      k0 = 0,
  	      // Tracks the last node in this layer scanned for crossings with a type-1
  	      // segment.
  	      scanPos = 0,
  	      prevLayerLength = prevLayer.length,
  	      lastNode = _.last(layer);

  	    _.forEach(layer, function(v, i) {
  	      var w = findOtherInnerSegmentNode(g, v),
  	        k1 = w ? g.node(w).order : prevLayerLength;

  	      if (w || v === lastNode) {
  	        _.forEach(layer.slice(scanPos, i +1), function(scanNode) {
  	          _.forEach(g.predecessors(scanNode), function(u) {
  	            var uLabel = g.node(u),
  	              uPos = uLabel.order;
  	            if ((uPos < k0 || k1 < uPos) &&
  	                !(uLabel.dummy && g.node(scanNode).dummy)) {
  	              addConflict(conflicts, u, scanNode);
  	            }
  	          });
  	        });
  	        scanPos = i + 1;
  	        k0 = k1;
  	      }
  	    });

  	    return layer;
  	  }

  	  _.reduce(layering, visitLayer);
  	  return conflicts;
  	}

  	function findType2Conflicts(g, layering) {
  	  var conflicts = {};

  	  function scan(south, southPos, southEnd, prevNorthBorder, nextNorthBorder) {
  	    var v;
  	    _.forEach(_.range(southPos, southEnd), function(i) {
  	      v = south[i];
  	      if (g.node(v).dummy) {
  	        _.forEach(g.predecessors(v), function(u) {
  	          var uNode = g.node(u);
  	          if (uNode.dummy &&
  	              (uNode.order < prevNorthBorder || uNode.order > nextNorthBorder)) {
  	            addConflict(conflicts, u, v);
  	          }
  	        });
  	      }
  	    });
  	  }


  	  function visitLayer(north, south) {
  	    var prevNorthPos = -1,
  	      nextNorthPos,
  	      southPos = 0;

  	    _.forEach(south, function(v, southLookahead) {
  	      if (g.node(v).dummy === "border") {
  	        var predecessors = g.predecessors(v);
  	        if (predecessors.length) {
  	          nextNorthPos = g.node(predecessors[0]).order;
  	          scan(south, southPos, southLookahead, prevNorthPos, nextNorthPos);
  	          southPos = southLookahead;
  	          prevNorthPos = nextNorthPos;
  	        }
  	      }
  	      scan(south, southPos, south.length, nextNorthPos, north.length);
  	    });

  	    return south;
  	  }

  	  _.reduce(layering, visitLayer);
  	  return conflicts;
  	}

  	function findOtherInnerSegmentNode(g, v) {
  	  if (g.node(v).dummy) {
  	    return _.find(g.predecessors(v), function(u) {
  	      return g.node(u).dummy;
  	    });
  	  }
  	}

  	function addConflict(conflicts, v, w) {
  	  if (v > w) {
  	    var tmp = v;
  	    v = w;
  	    w = tmp;
  	  }

  	  var conflictsV = conflicts[v];
  	  if (!conflictsV) {
  	    conflicts[v] = conflictsV = {};
  	  }
  	  conflictsV[w] = true;
  	}

  	function hasConflict(conflicts, v, w) {
  	  if (v > w) {
  	    var tmp = v;
  	    v = w;
  	    w = tmp;
  	  }
  	  return _.has(conflicts[v], w);
  	}

  	/*
  	 * Try to align nodes into vertical "blocks" where possible. This algorithm
  	 * attempts to align a node with one of its median neighbors. If the edge
  	 * connecting a neighbor is a type-1 conflict then we ignore that possibility.
  	 * If a previous node has already formed a block with a node after the node
  	 * we're trying to form a block with, we also ignore that possibility - our
  	 * blocks would be split in that scenario.
  	 */
  	function verticalAlignment(g, layering, conflicts, neighborFn) {
  	  var root = {},
  	    align = {},
  	    pos = {};

  	  // We cache the position here based on the layering because the graph and
  	  // layering may be out of sync. The layering matrix is manipulated to
  	  // generate different extreme alignments.
  	  _.forEach(layering, function(layer) {
  	    _.forEach(layer, function(v, order) {
  	      root[v] = v;
  	      align[v] = v;
  	      pos[v] = order;
  	    });
  	  });

  	  _.forEach(layering, function(layer) {
  	    var prevIdx = -1;
  	    _.forEach(layer, function(v) {
  	      var ws = neighborFn(v);
  	      if (ws.length) {
  	        ws = _.sortBy(ws, function(w) { return pos[w]; });
  	        var mp = (ws.length - 1) / 2;
  	        for (var i = Math.floor(mp), il = Math.ceil(mp); i <= il; ++i) {
  	          var w = ws[i];
  	          if (align[v] === v &&
  	              prevIdx < pos[w] &&
  	              !hasConflict(conflicts, v, w)) {
  	            align[w] = v;
  	            align[v] = root[v] = root[w];
  	            prevIdx = pos[w];
  	          }
  	        }
  	      }
  	    });
  	  });

  	  return { root: root, align: align };
  	}

  	function horizontalCompaction(g, layering, root, align, reverseSep) {
  	  // This portion of the algorithm differs from BK due to a number of problems.
  	  // Instead of their algorithm we construct a new block graph and do two
  	  // sweeps. The first sweep places blocks with the smallest possible
  	  // coordinates. The second sweep removes unused space by moving blocks to the
  	  // greatest coordinates without violating separation.
  	  var xs = {},
  	    blockG = buildBlockGraph(g, layering, root, reverseSep),
  	    borderType = reverseSep ? "borderLeft" : "borderRight";

  	  function iterate(setXsFunc, nextNodesFunc) {
  	    var stack = blockG.nodes();
  	    var elem = stack.pop();
  	    var visited = {};
  	    while (elem) {
  	      if (visited[elem]) {
  	        setXsFunc(elem);
  	      } else {
  	        visited[elem] = true;
  	        stack.push(elem);
  	        stack = stack.concat(nextNodesFunc(elem));
  	      }

  	      elem = stack.pop();
  	    }
  	  }

  	  // First pass, assign smallest coordinates
  	  function pass1(elem) {
  	    xs[elem] = blockG.inEdges(elem).reduce(function(acc, e) {
  	      return Math.max(acc, xs[e.v] + blockG.edge(e));
  	    }, 0);
  	  }

  	  // Second pass, assign greatest coordinates
  	  function pass2(elem) {
  	    var min = blockG.outEdges(elem).reduce(function(acc, e) {
  	      return Math.min(acc, xs[e.w] - blockG.edge(e));
  	    }, Number.POSITIVE_INFINITY);

  	    var node = g.node(elem);
  	    if (min !== Number.POSITIVE_INFINITY && node.borderType !== borderType) {
  	      xs[elem] = Math.max(xs[elem], min);
  	    }
  	  }

  	  iterate(pass1, blockG.predecessors.bind(blockG));
  	  iterate(pass2, blockG.successors.bind(blockG));

  	  // Assign x coordinates to all nodes
  	  _.forEach(align, function(v) {
  	    xs[v] = xs[root[v]];
  	  });

  	  return xs;
  	}


  	function buildBlockGraph(g, layering, root, reverseSep) {
  	  var blockGraph = new Graph(),
  	    graphLabel = g.graph(),
  	    sepFn = sep(graphLabel.nodesep, graphLabel.edgesep, reverseSep);

  	  _.forEach(layering, function(layer) {
  	    var u;
  	    _.forEach(layer, function(v) {
  	      var vRoot = root[v];
  	      blockGraph.setNode(vRoot);
  	      if (u) {
  	        var uRoot = root[u],
  	          prevMax = blockGraph.edge(uRoot, vRoot);
  	        blockGraph.setEdge(uRoot, vRoot, Math.max(sepFn(g, v, u), prevMax || 0));
  	      }
  	      u = v;
  	    });
  	  });

  	  return blockGraph;
  	}

  	/*
  	 * Returns the alignment that has the smallest width of the given alignments.
  	 */
  	function findSmallestWidthAlignment(g, xss) {
  	  return _.minBy(_.values(xss), function (xs) {
  	    var max = Number.NEGATIVE_INFINITY;
  	    var min = Number.POSITIVE_INFINITY;

  	    _.forIn(xs, function (x, v) {
  	      var halfWidth = width(g, v) / 2;

  	      max = Math.max(x + halfWidth, max);
  	      min = Math.min(x - halfWidth, min);
  	    });

  	    return max - min;
  	  });
  	}

  	/*
  	 * Align the coordinates of each of the layout alignments such that
  	 * left-biased alignments have their minimum coordinate at the same point as
  	 * the minimum coordinate of the smallest width alignment and right-biased
  	 * alignments have their maximum coordinate at the same point as the maximum
  	 * coordinate of the smallest width alignment.
  	 */
  	function alignCoordinates(xss, alignTo) {
  	  var alignToVals = _.values(alignTo),
  	    alignToMin = _.min(alignToVals),
  	    alignToMax = _.max(alignToVals);

  	  _.forEach(["u", "d"], function(vert) {
  	    _.forEach(["l", "r"], function(horiz) {
  	      var alignment = vert + horiz,
  	        xs = xss[alignment],
  	        delta;
  	      if (xs === alignTo) return;

  	      var xsVals = _.values(xs);
  	      delta = horiz === "l" ? alignToMin - _.min(xsVals) : alignToMax - _.max(xsVals);

  	      if (delta) {
  	        xss[alignment] = _.mapValues(xs, function(x) { return x + delta; });
  	      }
  	    });
  	  });
  	}

  	function balance(xss, align) {
  	  return _.mapValues(xss.ul, function(ignore, v) {
  	    if (align) {
  	      return xss[align.toLowerCase()][v];
  	    } else {
  	      var xs = _.sortBy(_.map(xss, v));
  	      return (xs[1] + xs[2]) / 2;
  	    }
  	  });
  	}

  	function positionX(g) {
  	  var layering = util.buildLayerMatrix(g);
  	  var conflicts = _.merge(
  	    findType1Conflicts(g, layering),
  	    findType2Conflicts(g, layering));

  	  var xss = {};
  	  var adjustedLayering;
  	  _.forEach(["u", "d"], function(vert) {
  	    adjustedLayering = vert === "u" ? layering : _.values(layering).reverse();
  	    _.forEach(["l", "r"], function(horiz) {
  	      if (horiz === "r") {
  	        adjustedLayering = _.map(adjustedLayering, function(inner) {
  	          return _.values(inner).reverse();
  	        });
  	      }

  	      var neighborFn = (vert === "u" ? g.predecessors : g.successors).bind(g);
  	      var align = verticalAlignment(g, adjustedLayering, conflicts, neighborFn);
  	      var xs = horizontalCompaction(g, adjustedLayering,
  	        align.root, align.align, horiz === "r");
  	      if (horiz === "r") {
  	        xs = _.mapValues(xs, function(x) { return -x; });
  	      }
  	      xss[vert + horiz] = xs;
  	    });
  	  });

  	  var smallestWidth = findSmallestWidthAlignment(g, xss);
  	  alignCoordinates(xss, smallestWidth);
  	  return balance(xss, g.graph().align);
  	}

  	function sep(nodeSep, edgeSep, reverseSep) {
  	  return function(g, v, w) {
  	    var vLabel = g.node(v);
  	    var wLabel = g.node(w);
  	    var sum = 0;
  	    var delta;

  	    sum += vLabel.width / 2;
  	    if (_.has(vLabel, "labelpos")) {
  	      switch (vLabel.labelpos.toLowerCase()) {
  	      case "l": delta = -vLabel.width / 2; break;
  	      case "r": delta = vLabel.width / 2; break;
  	      }
  	    }
  	    if (delta) {
  	      sum += reverseSep ? delta : -delta;
  	    }
  	    delta = 0;

  	    sum += (vLabel.dummy ? edgeSep : nodeSep) / 2;
  	    sum += (wLabel.dummy ? edgeSep : nodeSep) / 2;

  	    sum += wLabel.width / 2;
  	    if (_.has(wLabel, "labelpos")) {
  	      switch (wLabel.labelpos.toLowerCase()) {
  	      case "l": delta = wLabel.width / 2; break;
  	      case "r": delta = -wLabel.width / 2; break;
  	      }
  	    }
  	    if (delta) {
  	      sum += reverseSep ? delta : -delta;
  	    }
  	    delta = 0;

  	    return sum;
  	  };
  	}

  	function width(g, v) {
  	  return g.node(v).width;
  	}
  	return bk;
  }

  var position_1;
  var hasRequiredPosition;

  function requirePosition () {
  	if (hasRequiredPosition) return position_1;
  	hasRequiredPosition = 1;

  	var _ = requireLodash();
  	var util = requireUtil$1();
  	var positionX = requireBk().positionX;

  	position_1 = position;

  	function position(g) {
  	  g = util.asNonCompoundGraph(g);

  	  positionY(g);
  	  _.forEach(positionX(g), function(x, v) {
  	    g.node(v).x = x;
  	  });
  	}

  	function positionY(g) {
  	  var layering = util.buildLayerMatrix(g);
  	  var rankSep = g.graph().ranksep;
  	  var prevY = 0;
  	  _.forEach(layering, function(layer) {
  	    var maxHeight = _.max(_.map(layer, function(v) { return g.node(v).height; }));
  	    _.forEach(layer, function(v) {
  	      g.node(v).y = prevY + maxHeight / 2;
  	    });
  	    prevY += maxHeight + rankSep;
  	  });
  	}
  	return position_1;
  }

  var layout_1;
  var hasRequiredLayout;

  function requireLayout () {
  	if (hasRequiredLayout) return layout_1;
  	hasRequiredLayout = 1;

  	var _ = requireLodash();
  	var acyclic = requireAcyclic();
  	var normalize = requireNormalize();
  	var rank = requireRank();
  	var normalizeRanks = requireUtil$1().normalizeRanks;
  	var parentDummyChains = requireParentDummyChains();
  	var removeEmptyRanks = requireUtil$1().removeEmptyRanks;
  	var nestingGraph = requireNestingGraph();
  	var addBorderSegments = requireAddBorderSegments();
  	var coordinateSystem = requireCoordinateSystem();
  	var order = requireOrder();
  	var position = requirePosition();
  	var util = requireUtil$1();
  	var Graph = requireGraphlib().Graph;

  	layout_1 = layout;

  	function layout(g, opts) {
  	  var time = opts && opts.debugTiming ? util.time : util.notime;
  	  time("layout", function() {
  	    var layoutGraph = 
  	      time("  buildLayoutGraph", function() { return buildLayoutGraph(g); });
  	    time("  runLayout",        function() { runLayout(layoutGraph, time); });
  	    time("  updateInputGraph", function() { updateInputGraph(g, layoutGraph); });
  	  });
  	}

  	function runLayout(g, time) {
  	  time("    makeSpaceForEdgeLabels", function() { makeSpaceForEdgeLabels(g); });
  	  time("    removeSelfEdges",        function() { removeSelfEdges(g); });
  	  time("    acyclic",                function() { acyclic.run(g); });
  	  time("    nestingGraph.run",       function() { nestingGraph.run(g); });
  	  time("    rank",                   function() { rank(util.asNonCompoundGraph(g)); });
  	  time("    injectEdgeLabelProxies", function() { injectEdgeLabelProxies(g); });
  	  time("    removeEmptyRanks",       function() { removeEmptyRanks(g); });
  	  time("    nestingGraph.cleanup",   function() { nestingGraph.cleanup(g); });
  	  time("    normalizeRanks",         function() { normalizeRanks(g); });
  	  time("    assignRankMinMax",       function() { assignRankMinMax(g); });
  	  time("    removeEdgeLabelProxies", function() { removeEdgeLabelProxies(g); });
  	  time("    normalize.run",          function() { normalize.run(g); });
  	  time("    parentDummyChains",      function() { parentDummyChains(g); });
  	  time("    addBorderSegments",      function() { addBorderSegments(g); });
  	  time("    order",                  function() { order(g); });
  	  time("    insertSelfEdges",        function() { insertSelfEdges(g); });
  	  time("    adjustCoordinateSystem", function() { coordinateSystem.adjust(g); });
  	  time("    position",               function() { position(g); });
  	  time("    positionSelfEdges",      function() { positionSelfEdges(g); });
  	  time("    removeBorderNodes",      function() { removeBorderNodes(g); });
  	  time("    normalize.undo",         function() { normalize.undo(g); });
  	  time("    fixupEdgeLabelCoords",   function() { fixupEdgeLabelCoords(g); });
  	  time("    undoCoordinateSystem",   function() { coordinateSystem.undo(g); });
  	  time("    translateGraph",         function() { translateGraph(g); });
  	  time("    assignNodeIntersects",   function() { assignNodeIntersects(g); });
  	  time("    reversePoints",          function() { reversePointsForReversedEdges(g); });
  	  time("    acyclic.undo",           function() { acyclic.undo(g); });
  	}

  	/*
  	 * Copies final layout information from the layout graph back to the input
  	 * graph. This process only copies whitelisted attributes from the layout graph
  	 * to the input graph, so it serves as a good place to determine what
  	 * attributes can influence layout.
  	 */
  	function updateInputGraph(inputGraph, layoutGraph) {
  	  _.forEach(inputGraph.nodes(), function(v) {
  	    var inputLabel = inputGraph.node(v);
  	    var layoutLabel = layoutGraph.node(v);

  	    if (inputLabel) {
  	      inputLabel.x = layoutLabel.x;
  	      inputLabel.y = layoutLabel.y;

  	      if (layoutGraph.children(v).length) {
  	        inputLabel.width = layoutLabel.width;
  	        inputLabel.height = layoutLabel.height;
  	      }
  	    }
  	  });

  	  _.forEach(inputGraph.edges(), function(e) {
  	    var inputLabel = inputGraph.edge(e);
  	    var layoutLabel = layoutGraph.edge(e);

  	    inputLabel.points = layoutLabel.points;
  	    if (_.has(layoutLabel, "x")) {
  	      inputLabel.x = layoutLabel.x;
  	      inputLabel.y = layoutLabel.y;
  	    }
  	  });

  	  inputGraph.graph().width = layoutGraph.graph().width;
  	  inputGraph.graph().height = layoutGraph.graph().height;
  	}

  	var graphNumAttrs = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"];
  	var graphDefaults = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" };
  	var graphAttrs = ["acyclicer", "ranker", "rankdir", "align"];
  	var nodeNumAttrs = ["width", "height"];
  	var nodeDefaults = { width: 0, height: 0 };
  	var edgeNumAttrs = ["minlen", "weight", "width", "height", "labeloffset"];
  	var edgeDefaults = {
  	  minlen: 1, weight: 1, width: 0, height: 0,
  	  labeloffset: 10, labelpos: "r"
  	};
  	var edgeAttrs = ["labelpos"];

  	/*
  	 * Constructs a new graph from the input graph, which can be used for layout.
  	 * This process copies only whitelisted attributes from the input graph to the
  	 * layout graph. Thus this function serves as a good place to determine what
  	 * attributes can influence layout.
  	 */
  	function buildLayoutGraph(inputGraph) {
  	  var g = new Graph({ multigraph: true, compound: true });
  	  var graph = canonicalize(inputGraph.graph());

  	  g.setGraph(_.merge({},
  	    graphDefaults,
  	    selectNumberAttrs(graph, graphNumAttrs),
  	    _.pick(graph, graphAttrs)));

  	  _.forEach(inputGraph.nodes(), function(v) {
  	    var node = canonicalize(inputGraph.node(v));
  	    g.setNode(v, _.defaults(selectNumberAttrs(node, nodeNumAttrs), nodeDefaults));
  	    g.setParent(v, inputGraph.parent(v));
  	  });

  	  _.forEach(inputGraph.edges(), function(e) {
  	    var edge = canonicalize(inputGraph.edge(e));
  	    g.setEdge(e, _.merge({},
  	      edgeDefaults,
  	      selectNumberAttrs(edge, edgeNumAttrs),
  	      _.pick(edge, edgeAttrs)));
  	  });

  	  return g;
  	}

  	/*
  	 * This idea comes from the Gansner paper: to account for edge labels in our
  	 * layout we split each rank in half by doubling minlen and halving ranksep.
  	 * Then we can place labels at these mid-points between nodes.
  	 *
  	 * We also add some minimal padding to the width to push the label for the edge
  	 * away from the edge itself a bit.
  	 */
  	function makeSpaceForEdgeLabels(g) {
  	  var graph = g.graph();
  	  graph.ranksep /= 2;
  	  _.forEach(g.edges(), function(e) {
  	    var edge = g.edge(e);
  	    edge.minlen *= 2;
  	    if (edge.labelpos.toLowerCase() !== "c") {
  	      if (graph.rankdir === "TB" || graph.rankdir === "BT") {
  	        edge.width += edge.labeloffset;
  	      } else {
  	        edge.height += edge.labeloffset;
  	      }
  	    }
  	  });
  	}

  	/*
  	 * Creates temporary dummy nodes that capture the rank in which each edge's
  	 * label is going to, if it has one of non-zero width and height. We do this
  	 * so that we can safely remove empty ranks while preserving balance for the
  	 * label's position.
  	 */
  	function injectEdgeLabelProxies(g) {
  	  _.forEach(g.edges(), function(e) {
  	    var edge = g.edge(e);
  	    if (edge.width && edge.height) {
  	      var v = g.node(e.v);
  	      var w = g.node(e.w);
  	      var label = { rank: (w.rank - v.rank) / 2 + v.rank, e: e };
  	      util.addDummyNode(g, "edge-proxy", label, "_ep");
  	    }
  	  });
  	}

  	function assignRankMinMax(g) {
  	  var maxRank = 0;
  	  _.forEach(g.nodes(), function(v) {
  	    var node = g.node(v);
  	    if (node.borderTop) {
  	      node.minRank = g.node(node.borderTop).rank;
  	      node.maxRank = g.node(node.borderBottom).rank;
  	      maxRank = _.max(maxRank, node.maxRank);
  	    }
  	  });
  	  g.graph().maxRank = maxRank;
  	}

  	function removeEdgeLabelProxies(g) {
  	  _.forEach(g.nodes(), function(v) {
  	    var node = g.node(v);
  	    if (node.dummy === "edge-proxy") {
  	      g.edge(node.e).labelRank = node.rank;
  	      g.removeNode(v);
  	    }
  	  });
  	}

  	function translateGraph(g) {
  	  var minX = Number.POSITIVE_INFINITY;
  	  var maxX = 0;
  	  var minY = Number.POSITIVE_INFINITY;
  	  var maxY = 0;
  	  var graphLabel = g.graph();
  	  var marginX = graphLabel.marginx || 0;
  	  var marginY = graphLabel.marginy || 0;

  	  function getExtremes(attrs) {
  	    var x = attrs.x;
  	    var y = attrs.y;
  	    var w = attrs.width;
  	    var h = attrs.height;
  	    minX = Math.min(minX, x - w / 2);
  	    maxX = Math.max(maxX, x + w / 2);
  	    minY = Math.min(minY, y - h / 2);
  	    maxY = Math.max(maxY, y + h / 2);
  	  }

  	  _.forEach(g.nodes(), function(v) { getExtremes(g.node(v)); });
  	  _.forEach(g.edges(), function(e) {
  	    var edge = g.edge(e);
  	    if (_.has(edge, "x")) {
  	      getExtremes(edge);
  	    }
  	  });

  	  minX -= marginX;
  	  minY -= marginY;

  	  _.forEach(g.nodes(), function(v) {
  	    var node = g.node(v);
  	    node.x -= minX;
  	    node.y -= minY;
  	  });

  	  _.forEach(g.edges(), function(e) {
  	    var edge = g.edge(e);
  	    _.forEach(edge.points, function(p) {
  	      p.x -= minX;
  	      p.y -= minY;
  	    });
  	    if (_.has(edge, "x")) { edge.x -= minX; }
  	    if (_.has(edge, "y")) { edge.y -= minY; }
  	  });

  	  graphLabel.width = maxX - minX + marginX;
  	  graphLabel.height = maxY - minY + marginY;
  	}

  	function assignNodeIntersects(g) {
  	  _.forEach(g.edges(), function(e) {
  	    var edge = g.edge(e);
  	    var nodeV = g.node(e.v);
  	    var nodeW = g.node(e.w);
  	    var p1, p2;
  	    if (!edge.points) {
  	      edge.points = [];
  	      p1 = nodeW;
  	      p2 = nodeV;
  	    } else {
  	      p1 = edge.points[0];
  	      p2 = edge.points[edge.points.length - 1];
  	    }
  	    edge.points.unshift(util.intersectRect(nodeV, p1));
  	    edge.points.push(util.intersectRect(nodeW, p2));
  	  });
  	}

  	function fixupEdgeLabelCoords(g) {
  	  _.forEach(g.edges(), function(e) {
  	    var edge = g.edge(e);
  	    if (_.has(edge, "x")) {
  	      if (edge.labelpos === "l" || edge.labelpos === "r") {
  	        edge.width -= edge.labeloffset;
  	      }
  	      switch (edge.labelpos) {
  	      case "l": edge.x -= edge.width / 2 + edge.labeloffset; break;
  	      case "r": edge.x += edge.width / 2 + edge.labeloffset; break;
  	      }
  	    }
  	  });
  	}

  	function reversePointsForReversedEdges(g) {
  	  _.forEach(g.edges(), function(e) {
  	    var edge = g.edge(e);
  	    if (edge.reversed) {
  	      edge.points.reverse();
  	    }
  	  });
  	}

  	function removeBorderNodes(g) {
  	  _.forEach(g.nodes(), function(v) {
  	    if (g.children(v).length) {
  	      var node = g.node(v);
  	      var t = g.node(node.borderTop);
  	      var b = g.node(node.borderBottom);
  	      var l = g.node(_.last(node.borderLeft));
  	      var r = g.node(_.last(node.borderRight));

  	      node.width = Math.abs(r.x - l.x);
  	      node.height = Math.abs(b.y - t.y);
  	      node.x = l.x + node.width / 2;
  	      node.y = t.y + node.height / 2;
  	    }
  	  });

  	  _.forEach(g.nodes(), function(v) {
  	    if (g.node(v).dummy === "border") {
  	      g.removeNode(v);
  	    }
  	  });
  	}

  	function removeSelfEdges(g) {
  	  _.forEach(g.edges(), function(e) {
  	    if (e.v === e.w) {
  	      var node = g.node(e.v);
  	      if (!node.selfEdges) {
  	        node.selfEdges = [];
  	      }
  	      node.selfEdges.push({ e: e, label: g.edge(e) });
  	      g.removeEdge(e);
  	    }
  	  });
  	}

  	function insertSelfEdges(g) {
  	  var layers = util.buildLayerMatrix(g);
  	  _.forEach(layers, function(layer) {
  	    var orderShift = 0;
  	    _.forEach(layer, function(v, i) {
  	      var node = g.node(v);
  	      node.order = i + orderShift;
  	      _.forEach(node.selfEdges, function(selfEdge) {
  	        util.addDummyNode(g, "selfedge", {
  	          width: selfEdge.label.width,
  	          height: selfEdge.label.height,
  	          rank: node.rank,
  	          order: i + (++orderShift),
  	          e: selfEdge.e,
  	          label: selfEdge.label
  	        }, "_se");
  	      });
  	      delete node.selfEdges;
  	    });
  	  });
  	}

  	function positionSelfEdges(g) {
  	  _.forEach(g.nodes(), function(v) {
  	    var node = g.node(v);
  	    if (node.dummy === "selfedge") {
  	      var selfNode = g.node(node.e.v);
  	      var x = selfNode.x + selfNode.width / 2;
  	      var y = selfNode.y;
  	      var dx = node.x - x;
  	      var dy = selfNode.height / 2;
  	      g.setEdge(node.e, node.label);
  	      g.removeNode(v);
  	      node.label.points = [
  	        { x: x + 2 * dx / 3, y: y - dy },
  	        { x: x + 5 * dx / 6, y: y - dy },
  	        { x: x +     dx    , y: y },
  	        { x: x + 5 * dx / 6, y: y + dy },
  	        { x: x + 2 * dx / 3, y: y + dy }
  	      ];
  	      node.label.x = node.x;
  	      node.label.y = node.y;
  	    }
  	  });
  	}

  	function selectNumberAttrs(obj, attrs) {
  	  return _.mapValues(_.pick(obj, attrs), Number);
  	}

  	function canonicalize(attrs) {
  	  var newAttrs = {};
  	  _.forEach(attrs, function(v, k) {
  	    newAttrs[k.toLowerCase()] = v;
  	  });
  	  return newAttrs;
  	}
  	return layout_1;
  }

  var debug;
  var hasRequiredDebug;

  function requireDebug () {
  	if (hasRequiredDebug) return debug;
  	hasRequiredDebug = 1;
  	var _ = requireLodash();
  	var util = requireUtil$1();
  	var Graph = requireGraphlib().Graph;

  	debug = {
  	  debugOrdering: debugOrdering
  	};

  	/* istanbul ignore next */
  	function debugOrdering(g) {
  	  var layerMatrix = util.buildLayerMatrix(g);

  	  var h = new Graph({ compound: true, multigraph: true }).setGraph({});

  	  _.forEach(g.nodes(), function(v) {
  	    h.setNode(v, { label: v });
  	    h.setParent(v, "layer" + g.node(v).rank);
  	  });

  	  _.forEach(g.edges(), function(e) {
  	    h.setEdge(e.v, e.w, {}, e.name);
  	  });

  	  _.forEach(layerMatrix, function(layer, i) {
  	    var layerV = "layer" + i;
  	    h.setNode(layerV, { rank: "same" });
  	    _.reduce(layer, function(u, v) {
  	      h.setEdge(u, v, { style: "invis" });
  	      return v;
  	    });
  	  });

  	  return h;
  	}
  	return debug;
  }

  var version;
  var hasRequiredVersion;

  function requireVersion () {
  	if (hasRequiredVersion) return version;
  	hasRequiredVersion = 1;
  	version = "0.8.5";
  	return version;
  }

  /*
  Copyright (c) 2012-2014 Chris Pettitt

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
  */

  var dagre$1;
  var hasRequiredDagre;

  function requireDagre () {
  	if (hasRequiredDagre) return dagre$1;
  	hasRequiredDagre = 1;
  	dagre$1 = {
  	  graphlib: requireGraphlib(),

  	  layout: requireLayout(),
  	  debug: requireDebug(),
  	  util: {
  	    time: requireUtil$1().time,
  	    notime: requireUtil$1().notime
  	  },
  	  version: requireVersion()
  	};
  	return dagre$1;
  }

  var dagreExports = requireDagre();
  var dagre = /*@__PURE__*/getDefaultExportFromCjs(dagreExports);

  /**
   * <zh/> Dagre 布局
   *
   * <en/> Dagre layout
   */
  class DagreLayout {
      constructor(options) {
          this.id = 'dagre';
          this.options = {};
          Object.assign(this.options, DagreLayout.defaultOptions, options);
      }
      execute(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              return this.genericDagreLayout(false, graph, Object.assign(Object.assign({}, this.options), options));
          });
      }
      assign(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              yield this.genericDagreLayout(true, graph, Object.assign(Object.assign({}, this.options), options));
          });
      }
      genericDagreLayout(assign, graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              const { nodeSize } = options;
              const g = new dagreExports.graphlib.Graph();
              g.setGraph(options);
              g.setDefaultEdgeLabel(() => ({}));
              const nodes = graph.getAllNodes();
              const edges = graph.getAllEdges();
              if ([...nodes, ...edges].some(({ id }) => isNumber(id))) {
                  console.error('Dagre layout only support string id, it will convert number to string.');
              }
              graph.getAllNodes().forEach((node) => {
                  const { id } = node;
                  const data = Object.assign({}, node.data);
                  if (nodeSize !== undefined) {
                      const [width, height] = parseSize(isFunction(nodeSize) ? nodeSize(node) : nodeSize);
                      Object.assign(data, { width, height });
                  }
                  g.setNode(id.toString(), data);
              });
              graph.getAllEdges().forEach(({ id, source, target }) => {
                  g.setEdge(source.toString(), target.toString(), { id });
              });
              dagre.layout(g);
              const mapping = { nodes: [], edges: [] };
              g.nodes().forEach((id) => {
                  const data = g.node(id);
                  mapping.nodes.push({ id, data });
                  if (assign)
                      graph.mergeNodeData(id, data);
              });
              g.edges().forEach((edge) => {
                  const _a = g.edge(edge), { id } = _a, data = __rest(_a, ["id"]);
                  const { v: source, w: target } = edge;
                  mapping.edges.push({ id, source, target, data });
                  if (assign)
                      graph.mergeEdgeData(id, data);
              });
              return mapping;
          });
      }
  }
  DagreLayout.defaultOptions = {};

  // represents a body(a point mass) and its position
  class Body {
      constructor(params) {
          /**
           * the id of this body, the same with the node id
           * @type  {number}
           */
          this.id = params.id || 0;
          /**
           * the position of this body
           * @type  {number}
           */
          this.rx = params.rx;
          /**
           * the position of this body
           * @type  {number}
           */
          this.ry = params.ry;
          /**
           * the force acting on this body
           * @type  {number}
           */
          this.fx = 0;
          /**
           * the force acting on this body
           * @type  {number}
           */
          this.fy = 0;
          /**
           * the mass of this body, =1 for a node
           * @type  {number}
           */
          this.mass = params.mass;
          /**
           * the degree of the node represented by this body
           * @type  {number}
           */
          this.degree = params.degree;
          /**
           * the parameter for repulsive force, = kr
           * @type  {number}
           */
          this.g = params.g || 0;
      }
      // returns the euclidean distance
      distanceTo(bo) {
          const dx = this.rx - bo.rx;
          const dy = this.ry - bo.ry;
          return Math.hypot(dx, dy);
      }
      setPos(x, y) {
          this.rx = x;
          this.ry = y;
      }
      // resets the forces
      resetForce() {
          this.fx = 0;
          this.fy = 0;
      }
      addForce(b) {
          const dx = b.rx - this.rx;
          const dy = b.ry - this.ry;
          let dist = Math.hypot(dx, dy);
          dist = dist < 0.0001 ? 0.0001 : dist;
          // the repulsive defined by force atlas 2
          const F = (this.g * (this.degree + 1) * (b.degree + 1)) / dist;
          this.fx += (F * dx) / dist;
          this.fy += (F * dy) / dist;
      }
      // if quad contains this body
      in(quad) {
          return quad.contains(this.rx, this.ry);
      }
      // returns a new body
      add(bo) {
          const nenwMass = this.mass + bo.mass;
          const x = (this.rx * this.mass + bo.rx * bo.mass) / nenwMass;
          const y = (this.ry * this.mass + bo.ry * bo.mass) / nenwMass;
          const dg = this.degree + bo.degree;
          const params = {
              rx: x,
              ry: y,
              mass: nenwMass,
              degree: dg,
          };
          return new Body(params);
      }
  }

  class Quad {
      constructor(params) {
          /**
           * the center position of this quad
           * @type  {number}
           */
          this.xmid = params.xmid;
          /**
           * the center position of this quad
           * @type  {number}
           */
          this.ymid = params.ymid;
          /**
           * the length of this quad
           * @type  {number}
           */
          this.length = params.length;
          /**
           * the mass center of this quad
           * @type  {number}
           */
          this.massCenter = params.massCenter || [0, 0];
          /**
           * the mass of this quad
           * @type  {number}
           */
          this.mass = params.mass || 1;
      }
      getLength() {
          return this.length;
      }
      contains(x, y) {
          const halfLen = this.length / 2;
          return (x <= this.xmid + halfLen &&
              x >= this.xmid - halfLen &&
              y <= this.ymid + halfLen &&
              y >= this.ymid - halfLen);
      }
      // northwest quadrant
      // tslint:disable-next-line
      NW() {
          const x = this.xmid - this.length / 4;
          const y = this.ymid + this.length / 4;
          const len = this.length / 2;
          const params = {
              xmid: x,
              ymid: y,
              length: len,
          };
          const NW = new Quad(params);
          return NW;
      }
      // northeast
      // tslint:disable-next-line
      NE() {
          const x = this.xmid + this.length / 4;
          const y = this.ymid + this.length / 4;
          const len = this.length / 2;
          const params = {
              xmid: x,
              ymid: y,
              length: len,
          };
          const NE = new Quad(params);
          return NE;
      }
      // southwest
      // tslint:disable-next-line
      SW() {
          const x = this.xmid - this.length / 4;
          const y = this.ymid - this.length / 4;
          const len = this.length / 2;
          const params = {
              xmid: x,
              ymid: y,
              length: len,
          };
          const SW = new Quad(params);
          return SW;
      }
      // southeast
      // tslint:disable-next-line
      SE() {
          const x = this.xmid + this.length / 4;
          const y = this.ymid - this.length / 4;
          const len = this.length / 2;
          const params = {
              xmid: x,
              ymid: y,
              length: len,
          };
          const SE = new Quad(params);
          return SE;
      }
  }

  /**
   * @fileOverview quadTree
   * @author shiwu.wyy@antfin.com
   */
  class QuadTree {
      // each quadtree represents a quadrant and an aggregate body
      // that represents all bodies inside the quadrant
      constructor(param) {
          /**
           * (aggregated) body in this quad
           * @type  {object}
           */
          this.body = null;
          /**
           * tree representing the northwest quadrant
           * @type  {object}
           */
          this.quad = null;
          this.NW = null;
          this.NE = null;
          this.SW = null;
          this.SE = null;
          /**
           * threshold
           * @type  {number}
           */
          this.theta = 0.5;
          if (param != null)
              this.quad = param;
      }
      // insert a body(node) into the tree
      insert(bo) {
          // if this node does not contain a body, put the new body bo here
          if (this.body == null) {
              this.body = bo;
              return;
          }
          // internal node
          if (!this._isExternal()) {
              // update mass info
              this.body = this.body.add(bo);
              // insert body into quadrant
              this._putBody(bo);
          }
          else {
              // external node
              // divide this region into four children
              if (this.quad) {
                  this.NW = new QuadTree(this.quad.NW());
                  this.NE = new QuadTree(this.quad.NE());
                  this.SW = new QuadTree(this.quad.SW());
                  this.SE = new QuadTree(this.quad.SE());
              }
              // insert this body and bo
              this._putBody(this.body);
              this._putBody(bo);
              // update the mass info
              this.body = this.body.add(bo);
          }
      }
      // inserts bo into a quad
      // tslint:disable-next-line
      _putBody(bo) {
          if (!this.quad)
              return;
          if (bo.in(this.quad.NW()) && this.NW)
              this.NW.insert(bo);
          else if (bo.in(this.quad.NE()) && this.NE)
              this.NE.insert(bo);
          else if (bo.in(this.quad.SW()) && this.SW)
              this.SW.insert(bo);
          else if (bo.in(this.quad.SE()) && this.SE)
              this.SE.insert(bo);
      }
      // tslint:disable-next-line
      _isExternal() {
          // four children are null
          return (this.NW == null && this.NE == null && this.SW == null && this.SE == null);
      }
      // update the forces
      updateForce(bo) {
          if (this.body == null || bo === this.body) {
              return;
          }
          // if the current node is external
          if (this._isExternal())
              bo.addForce(this.body);
          // internal nodes
          else {
              const s = this.quad ? this.quad.getLength() : 0;
              const d = this.body.distanceTo(bo);
              // b is far enough
              if (s / d < this.theta)
                  bo.addForce(this.body);
              else {
                  this.NW && this.NW.updateForce(bo);
                  this.NE && this.NE.updateForce(bo);
                  this.SW && this.SW.updateForce(bo);
                  this.SE && this.SE.updateForce(bo);
              }
          }
      }
  }

  const DEFAULTS_LAYOUT_OPTIONS$5 = {
      center: [0, 0],
      width: 300,
      height: 300,
      kr: 5,
      kg: 1,
      mode: 'normal',
      preventOverlap: false,
      dissuadeHubs: false,
      maxIteration: 0,
      ks: 0.1,
      ksmax: 10,
      tao: 0.1,
  };
  /**
   * <zh/> Atlas2 力导向布局
   *
   * <en/> Force Atlas 2 layout
   */
  class ForceAtlas2Layout {
      constructor(options = {}) {
          this.options = options;
          this.id = 'forceAtlas2';
          this.options = Object.assign(Object.assign({}, DEFAULTS_LAYOUT_OPTIONS$5), options);
      }
      /**
       * Return the positions of nodes and edges(if needed).
       */
      execute(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              return this.genericForceAtlas2Layout(false, graph, options);
          });
      }
      /**
       * To directly assign the positions to the nodes.
       */
      assign(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              yield this.genericForceAtlas2Layout(true, graph, options);
          });
      }
      genericForceAtlas2Layout(assign, graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              const edges = graph.getAllEdges();
              const nodes = graph.getAllNodes();
              const mergedOptions = this.formatOptions(options, nodes.length);
              const { width, height, prune, maxIteration, nodeSize, center } = mergedOptions;
              if (!(nodes === null || nodes === void 0 ? void 0 : nodes.length) || nodes.length === 1) {
                  return handleSingleNodeGraph(graph, assign, center);
              }
              const calcNodes = nodes.map((node) => cloneFormatData(node, [width, height]));
              const calcEdges = edges.filter((edge) => {
                  const { source, target } = edge;
                  return source !== target;
              });
              const calcGraph = new Graph({
                  nodes: calcNodes,
                  edges: calcEdges,
              });
              const sizes = this.getSizes(calcGraph, nodeSize);
              this.run(calcGraph, graph, maxIteration, sizes, assign, mergedOptions);
              // if prune, place the leaves around their parents, and then re-layout for several iterations.
              if (prune) {
                  for (let j = 0; j < calcEdges.length; j += 1) {
                      const { source, target } = calcEdges[j];
                      const sourceDegree = calcGraph.getDegree(source);
                      const targetDegree = calcGraph.getDegree(source);
                      if (sourceDegree <= 1) {
                          const targetNode = calcGraph.getNode(target);
                          calcGraph.mergeNodeData(source, {
                              x: targetNode.data.x,
                              y: targetNode.data.y,
                          });
                      }
                      else if (targetDegree <= 1) {
                          const sourceNode = calcGraph.getNode(source);
                          calcGraph.mergeNodeData(target, {
                              x: sourceNode.data.x,
                              y: sourceNode.data.y,
                          });
                      }
                  }
                  const postOptions = Object.assign(Object.assign({}, mergedOptions), { prune: false, barnesHut: false });
                  this.run(calcGraph, graph, 100, sizes, assign, postOptions);
              }
              return {
                  nodes: calcNodes,
                  edges,
              };
          });
      }
      /**
       * Init the node positions if there is no initial positions.
       * And pre-calculate the size (max of width and height) for each node.
       * @param calcGraph graph for calculation
       * @param nodeSize node size config from layout options
       * @returns {SizeMap} node'id mapped to max of its width and height
       */
      getSizes(calcGraph, nodeSize) {
          const nodes = calcGraph.getAllNodes();
          const sizes = {};
          for (let i = 0; i < nodes.length; i += 1) {
              const node = nodes[i];
              sizes[node.id] = formatNodeSizeToNumber(nodeSize, undefined)(node);
          }
          return sizes;
      }
      /**
       * Format the options.
       * @param options input options
       * @param nodeNum number of nodes
       * @returns formatted options
       */
      formatOptions(options = {}, nodeNum) {
          const mergedOptions = Object.assign(Object.assign({}, this.options), options);
          const { center, width, height, barnesHut, prune, maxIteration, kr, kg } = mergedOptions;
          mergedOptions.width =
              !width && typeof window !== 'undefined' ? window.innerWidth : width;
          mergedOptions.height =
              !height && typeof window !== 'undefined' ? window.innerHeight : height;
          mergedOptions.center = !center
              ? [mergedOptions.width / 2, mergedOptions.height / 2]
              : center;
          if (barnesHut === undefined && nodeNum > 250) {
              mergedOptions.barnesHut = true;
          }
          if (prune === undefined && nodeNum > 100)
              mergedOptions.prune = true;
          if (maxIteration === 0 && !prune) {
              mergedOptions.maxIteration = 250;
              if (nodeNum <= 200 && nodeNum > 100)
                  mergedOptions.maxIteration = 1000;
              else if (nodeNum > 200)
                  mergedOptions.maxIteration = 1200;
          }
          else if (maxIteration === 0 && prune) {
              mergedOptions.maxIteration = 100;
              if (nodeNum <= 200 && nodeNum > 100)
                  mergedOptions.maxIteration = 500;
              else if (nodeNum > 200)
                  mergedOptions.maxIteration = 950;
          }
          if (!kr) {
              mergedOptions.kr = 50;
              if (nodeNum > 100 && nodeNum <= 500)
                  mergedOptions.kr = 20;
              else if (nodeNum > 500)
                  mergedOptions.kr = 1;
          }
          if (!kg) {
              mergedOptions.kg = 20;
              if (nodeNum > 100 && nodeNum <= 500)
                  mergedOptions.kg = 10;
              else if (nodeNum > 500)
                  mergedOptions.kg = 1;
          }
          return mergedOptions;
      }
      /**
       * Loops for fa2.
       * @param calcGraph graph for calculation
       * @param graph original graph
       * @param iteration iteration number
       * @param sizes nodes' size
       * @param options formatted layout options
       * @returns
       */
      run(calcGraph, graph, iteration, sizes, assign, options) {
          const { kr, barnesHut, onTick } = options;
          const calcNodes = calcGraph.getAllNodes();
          let sg = 0;
          let iter = iteration;
          const forces = {};
          const preForces = {};
          const bodies = {};
          for (let i = 0; i < calcNodes.length; i += 1) {
              const { data, id } = calcNodes[i];
              forces[id] = [0, 0];
              if (barnesHut) {
                  const params = {
                      id: i,
                      rx: data.x,
                      ry: data.y,
                      mass: 1,
                      g: kr,
                      degree: calcGraph.getDegree(id),
                  };
                  bodies[id] = new Body(params);
              }
          }
          while (iter > 0) {
              sg = this.oneStep(calcGraph, {
                  iter,
                  preventOverlapIters: 50,
                  krPrime: 100,
                  sg,
                  forces,
                  preForces,
                  bodies,
                  sizes,
              }, options);
              iter--;
              onTick === null || onTick === void 0 ? void 0 : onTick({
                  nodes: calcNodes,
                  edges: graph.getAllEdges(),
              });
              // if (assign) {
              //   calcNodes.forEach(({ id, data }) => graph.mergeNodeData(id, {
              //     x: data.x,
              //     y: data.y
              //   }))
              // }
          }
          return calcGraph;
      }
      /**
       * One step for a loop.
       * @param graph graph for calculation
       * @param params parameters for a loop
       * @param options formatted layout's input options
       * @returns
       */
      oneStep(graph, params, options) {
          const { iter, preventOverlapIters, krPrime, sg, preForces, bodies, sizes } = params;
          let { forces } = params;
          const { preventOverlap, barnesHut } = options;
          const nodes = graph.getAllNodes();
          for (let i = 0; i < nodes.length; i += 1) {
              const { id } = nodes[i];
              preForces[id] = [...forces[id]];
              forces[id] = [0, 0];
          }
          // attractive forces, existing on every actual edge
          forces = this.getAttrForces(graph, iter, preventOverlapIters, sizes, forces, options);
          // repulsive forces and Gravity, existing on every node pair
          // if preventOverlap, using the no-optimized method in the last preventOverlapIters instead.
          if (barnesHut &&
              ((preventOverlap && iter > preventOverlapIters) || !preventOverlap)) {
              forces = this.getOptRepGraForces(graph, forces, bodies, options);
          }
          else {
              forces = this.getRepGraForces(graph, iter, preventOverlapIters, forces, krPrime, sizes, options);
          }
          // update the positions
          return this.updatePos(graph, forces, preForces, sg, options);
      }
      /**
       * Calculate the attract forces for nodes.
       * @param graph graph for calculation
       * @param iter current iteration index
       * @param preventOverlapIters the iteration number for preventing overlappings
       * @param sizes nodes' sizes
       * @param forces forces for nodes, which will be modified
       * @param options formatted layout's input options
       * @returns
       */
      getAttrForces(graph, iter, preventOverlapIters, sizes, forces, options) {
          const { preventOverlap, dissuadeHubs, mode, prune } = options;
          const edges = graph.getAllEdges();
          for (let i = 0; i < edges.length; i += 1) {
              const { source, target } = edges[i];
              const sourceNode = graph.getNode(source);
              const targetNode = graph.getNode(target);
              const sourceDegree = graph.getDegree(source);
              const targetDegree = graph.getDegree(target);
              if (prune && (sourceDegree <= 1 || targetDegree <= 1))
                  continue;
              const dir = [
                  targetNode.data.x - sourceNode.data.x,
                  targetNode.data.y - sourceNode.data.y,
              ];
              let eucliDis = Math.hypot(dir[0], dir[1]);
              eucliDis = eucliDis < 0.0001 ? 0.0001 : eucliDis;
              dir[0] = dir[0] / eucliDis;
              dir[1] = dir[1] / eucliDis;
              if (preventOverlap && iter < preventOverlapIters) {
                  eucliDis = eucliDis - sizes[source] - sizes[target];
              }
              let fa1 = eucliDis;
              let fa2 = fa1;
              if (mode === 'linlog') {
                  fa1 = Math.log(1 + eucliDis);
                  fa2 = fa1;
              }
              if (dissuadeHubs) {
                  fa1 = eucliDis / sourceDegree;
                  fa2 = eucliDis / targetDegree;
              }
              if (preventOverlap && iter < preventOverlapIters && eucliDis <= 0) {
                  fa1 = 0;
                  fa2 = 0;
              }
              else if (preventOverlap && iter < preventOverlapIters && eucliDis > 0) {
                  fa1 = eucliDis;
                  fa2 = eucliDis;
              }
              forces[source][0] += fa1 * dir[0];
              forces[target][0] -= fa2 * dir[0];
              forces[source][1] += fa1 * dir[1];
              forces[target][1] -= fa2 * dir[1];
          }
          return forces;
      }
      /**
       * Calculate the repulsive forces for nodes under barnesHut mode.
       * @param graph graph for calculatiion
       * @param forces forces for nodes, which will be modified
       * @param bodies force body map
       * @param options formatted layout's input options
       * @returns
       */
      getOptRepGraForces(graph, forces, bodies, options) {
          const { kg, center, prune } = options;
          const nodes = graph.getAllNodes();
          const nodeNum = nodes.length;
          let minx = 9e10;
          let maxx = -9e10;
          let miny = 9e10;
          let maxy = -9e10;
          for (let i = 0; i < nodeNum; i += 1) {
              const { id, data } = nodes[i];
              if (prune && graph.getDegree(id) <= 1)
                  continue;
              bodies[id].setPos(data.x, data.y);
              if (data.x >= maxx)
                  maxx = data.x;
              if (data.x <= minx)
                  minx = data.x;
              if (data.y >= maxy)
                  maxy = data.y;
              if (data.y <= miny)
                  miny = data.y;
          }
          const width = Math.max(maxx - minx, maxy - miny);
          const quadParams = {
              xmid: (maxx + minx) / 2,
              ymid: (maxy + miny) / 2,
              length: width,
              massCenter: center,
              mass: nodeNum,
          };
          const quad = new Quad(quadParams);
          const quadTree = new QuadTree(quad);
          // build the tree, insert the nodes(quads) into the tree
          for (let i = 0; i < nodeNum; i += 1) {
              const { id } = nodes[i];
              if (prune && graph.getDegree(id) <= 1)
                  continue;
              if (bodies[id].in(quad))
                  quadTree.insert(bodies[id]);
          }
          // update the repulsive forces and the gravity.
          for (let i = 0; i < nodeNum; i += 1) {
              const { id, data } = nodes[i];
              const degree = graph.getDegree(id);
              if (prune && degree <= 1)
                  continue;
              bodies[id].resetForce();
              quadTree.updateForce(bodies[id]);
              forces[id][0] -= bodies[id].fx;
              forces[id][1] -= bodies[id].fy;
              // gravity
              const dir = [data.x - center[0], data.y - center[1]];
              let eucliDis = Math.hypot(dir[0], dir[1]);
              eucliDis = eucliDis < 0.0001 ? 0.0001 : eucliDis;
              dir[0] = dir[0] / eucliDis;
              dir[1] = dir[1] / eucliDis;
              const fg = kg * (degree + 1); // tslint:disable-line
              forces[id][0] -= fg * dir[0];
              forces[id][1] -= fg * dir[1];
          }
          return forces;
      }
      /**
       * Calculate the repulsive forces for nodes.
       * @param graph graph for calculatiion
       * @param iter current iteration index
       * @param preventOverlapIters the iteration number for preventing overlappings
       * @param forces forces for nodes, which will be modified
       * @param krPrime larger the krPrime, larger the repulsive force
       * @param sizes nodes' sizes
       * @param options formatted layout's input options
       * @returns
       */
      getRepGraForces(graph, iter, preventOverlapIters, forces, krPrime, sizes, options) {
          const { preventOverlap, kr, kg, center, prune } = options;
          const nodes = graph.getAllNodes();
          const nodeNum = nodes.length;
          for (let i = 0; i < nodeNum; i += 1) {
              const nodei = nodes[i];
              const degreei = graph.getDegree(nodei.id);
              for (let j = i + 1; j < nodeNum; j += 1) {
                  const nodej = nodes[j];
                  const degreej = graph.getDegree(nodej.id);
                  if (prune && (degreei <= 1 || degreej <= 1))
                      continue;
                  const dir = [nodej.data.x - nodei.data.x, nodej.data.y - nodei.data.y];
                  let eucliDis = Math.hypot(dir[0], dir[1]);
                  eucliDis = eucliDis < 0.0001 ? 0.0001 : eucliDis;
                  dir[0] = dir[0] / eucliDis;
                  dir[1] = dir[1] / eucliDis;
                  if (preventOverlap && iter < preventOverlapIters) {
                      eucliDis = eucliDis - sizes[nodei.id] - sizes[nodej.id];
                  }
                  let fr = (kr * (degreei + 1) * (degreej + 1)) / eucliDis;
                  if (preventOverlap && iter < preventOverlapIters && eucliDis < 0) {
                      fr = krPrime * (degreei + 1) * (degreej + 1);
                  }
                  else if (preventOverlap &&
                      iter < preventOverlapIters &&
                      eucliDis === 0) {
                      fr = 0;
                  }
                  else if (preventOverlap &&
                      iter < preventOverlapIters &&
                      eucliDis > 0) {
                      fr = (kr * (degreei + 1) * (degreej + 1)) / eucliDis;
                  }
                  forces[nodei.id][0] -= fr * dir[0];
                  forces[nodej.id][0] += fr * dir[0];
                  forces[nodei.id][1] -= fr * dir[1];
                  forces[nodej.id][1] += fr * dir[1];
              }
              // gravity
              const dir = [nodei.data.x - center[0], nodei.data.y - center[1]];
              const eucliDis = Math.hypot(dir[0], dir[1]);
              dir[0] = dir[0] / eucliDis;
              dir[1] = dir[1] / eucliDis;
              const fg = kg * (degreei + 1); // tslint:disable-line
              forces[nodei.id][0] -= fg * dir[0];
              forces[nodei.id][1] -= fg * dir[1];
          }
          return forces;
      }
      /**
       * Update node positions.
       * @param graph graph for calculatiion
       * @param forces forces for nodes, which will be modified
       * @param preForces previous forces for nodes, which will be modified
       * @param sg constant for move distance of one step
       * @param options formatted layout's input options
       * @returns
       */
      updatePos(graph, forces, preForces, sg, options) {
          const { ks, tao, prune, ksmax } = options;
          const nodes = graph.getAllNodes();
          const nodeNum = nodes.length;
          const swgns = [];
          const trans = [];
          // swg(G) and tra(G)
          let swgG = 0;
          let traG = 0;
          let usingSg = sg;
          for (let i = 0; i < nodeNum; i += 1) {
              const { id } = nodes[i];
              const degree = graph.getDegree(id);
              if (prune && degree <= 1)
                  continue;
              const minus = [
                  forces[id][0] - preForces[id][0],
                  forces[id][1] - preForces[id][1],
              ];
              const minusNorm = Math.hypot(minus[0], minus[1]);
              const add = [
                  forces[id][0] + preForces[id][0],
                  forces[id][1] + preForces[id][1],
              ];
              const addNorm = Math.hypot(add[0], add[1]);
              swgns[i] = minusNorm;
              trans[i] = addNorm / 2;
              swgG += (degree + 1) * swgns[i];
              traG += (degree + 1) * trans[i];
          }
          const preSG = usingSg;
          usingSg = (tao * traG) / swgG;
          if (preSG !== 0) {
              usingSg = usingSg > 1.5 * preSG ? 1.5 * preSG : usingSg;
          }
          // update the node positions
          for (let i = 0; i < nodeNum; i += 1) {
              const { id, data } = nodes[i];
              const degree = graph.getDegree(id);
              if (prune && degree <= 1)
                  continue;
              if (isNumber(data.fx) && isNumber(data.fy))
                  continue;
              let sn = (ks * usingSg) / (1 + usingSg * Math.sqrt(swgns[i]));
              let absForce = Math.hypot(forces[id][0], forces[id][1]);
              absForce = absForce < 0.0001 ? 0.0001 : absForce;
              const max = ksmax / absForce;
              sn = sn > max ? max : sn;
              const dnx = sn * forces[id][0];
              const dny = sn * forces[id][1];
              graph.mergeNodeData(id, {
                  x: data.x + dnx,
                  y: data.y + dny,
              });
          }
          return usingSg;
      }
  }

  const DEFAULTS_LAYOUT_OPTIONS$4 = {
      maxIteration: 1000,
      gravity: 10,
      speed: 5,
      clustering: false,
      clusterGravity: 10,
      width: 300,
      height: 300,
      nodeClusterBy: 'cluster',
  };
  const SPEED_DIVISOR$1 = 800;
  /**
   * <zh/> Fruchterman 力导向布局
   *
   * <en/> Fruchterman force-directed layout
   */
  class FruchtermanLayout {
      constructor(options = {}) {
          this.options = options;
          this.id = 'fruchterman';
          this.timeInterval = 0;
          this.running = false;
          this.options = Object.assign(Object.assign({}, DEFAULTS_LAYOUT_OPTIONS$4), options);
      }
      /**
       * Return the positions of nodes and edges(if needed).
       */
      execute(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              return this.genericFruchtermanLayout(false, graph, options);
          });
      }
      /**
       * To directly assign the positions to the nodes.
       */
      assign(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              yield this.genericFruchtermanLayout(true, graph, options);
          });
      }
      /**
       * Stop simulation immediately.
       */
      stop() {
          if (this.timeInterval && typeof window !== 'undefined') {
              window.clearInterval(this.timeInterval);
          }
          this.running = false;
      }
      /**
       * Manually steps the simulation by the specified number of iterations.
       * @see https://github.com/d3/d3-force#simulation_tick
       */
      tick(iterations = this.options.maxIteration || 1) {
          if (this.lastResult) {
              return this.lastResult;
          }
          for (let i = 0; i < iterations; i++) {
              this.runOneStep(this.lastGraph, this.lastClusterMap, this.lastOptions);
          }
          const result = {
              nodes: this.lastLayoutNodes,
              edges: this.lastLayoutEdges,
          };
          if (this.lastAssign) {
              result.nodes.forEach((node) => this.lastGraph.mergeNodeData(node.id, {
                  x: node.data.x,
                  y: node.data.y,
                  z: this.options.dimensions === 3 ? node.data.z : undefined,
              }));
          }
          return result;
      }
      genericFruchtermanLayout(assign, graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              if (this.running)
                  return;
              const formattedOptions = this.formatOptions(options);
              const { dimensions, width, height, center, clustering, nodeClusterBy, maxIteration, onTick, } = formattedOptions;
              const nodes = graph.getAllNodes();
              const edges = graph.getAllEdges();
              if (!(nodes === null || nodes === void 0 ? void 0 : nodes.length)) {
                  const result = { nodes: [], edges };
                  this.lastResult = result;
                  return result;
              }
              if (nodes.length === 1) {
                  if (assign) {
                      graph.mergeNodeData(nodes[0].id, {
                          x: center[0],
                          y: center[1],
                          z: dimensions === 3 ? center[2] : undefined,
                      });
                  }
                  const result = {
                      nodes: [
                          Object.assign(Object.assign({}, nodes[0]), { data: Object.assign(Object.assign({}, nodes[0].data), { x: center[0], y: center[1], z: dimensions === 3 ? center[2] : undefined }) }),
                      ],
                      edges,
                  };
                  this.lastResult = result;
                  return result;
              }
              const layoutNodes = nodes.map((node) => cloneFormatData(node, [width, height]));
              const calcGraph = new Graph({
                  nodes: layoutNodes,
                  edges,
              });
              // clustering info
              const clusterMap = {};
              if (clustering) {
                  layoutNodes.forEach((node) => {
                      const clusterValue = node.data[nodeClusterBy];
                      if (!clusterMap[clusterValue]) {
                          clusterMap[clusterValue] = {
                              name: clusterValue,
                              cx: 0,
                              cy: 0,
                              count: 0,
                          };
                      }
                  });
              }
              // Use them later in `tick`.
              this.lastLayoutNodes = layoutNodes;
              this.lastLayoutEdges = edges;
              this.lastAssign = assign;
              this.lastGraph = calcGraph;
              this.lastOptions = formattedOptions;
              this.lastClusterMap = clusterMap;
              if (typeof window === 'undefined')
                  return;
              let iter = 0;
              return new Promise((resolve) => {
                  // interval for render the result after each iteration
                  this.timeInterval = window.setInterval(() => {
                      if (!this.running) {
                          resolve({ nodes: layoutNodes, edges });
                          return;
                      }
                      this.runOneStep(calcGraph, clusterMap, formattedOptions);
                      if (assign) {
                          layoutNodes.forEach(({ id, data }) => graph.mergeNodeData(id, {
                              x: data.x,
                              y: data.y,
                              z: dimensions === 3 ? data.z : undefined,
                          }));
                      }
                      onTick === null || onTick === void 0 ? void 0 : onTick({
                          nodes: layoutNodes,
                          edges,
                      });
                      iter++;
                      if (iter >= maxIteration) {
                          window.clearInterval(this.timeInterval);
                          resolve({ nodes: layoutNodes, edges });
                      }
                  }, 0);
                  this.running = true;
              });
          });
      }
      formatOptions(options = {}) {
          const mergedOptions = Object.assign(Object.assign({}, this.options), options);
          const { clustering, nodeClusterBy } = mergedOptions;
          const { center: propsCenter, width: propsWidth, height: propsHeight, } = mergedOptions;
          mergedOptions.width =
              !propsWidth && typeof window !== 'undefined'
                  ? window.innerWidth
                  : propsWidth;
          mergedOptions.height =
              !propsHeight && typeof window !== 'undefined'
                  ? window.innerHeight
                  : propsHeight;
          mergedOptions.center = !propsCenter
              ? [mergedOptions.width / 2, mergedOptions.height / 2]
              : propsCenter;
          mergedOptions.clustering = clustering && !!nodeClusterBy;
          return mergedOptions;
      }
      runOneStep(calcGraph, clusterMap, options) {
          const { dimensions, height, width, gravity, center, speed, clustering, nodeClusterBy, clusterGravity: propsClusterGravity, } = options;
          const area = height * width;
          const maxDisplace = Math.sqrt(area) / 10;
          const nodes = calcGraph.getAllNodes();
          const k2 = area / (nodes.length + 1);
          const k = Math.sqrt(k2);
          const displacements = {};
          this.applyCalculate(calcGraph, displacements, k, k2);
          // gravity for clusters
          if (clustering) {
              // reset the clustering centers
              for (const key in clusterMap) {
                  clusterMap[key].cx = 0;
                  clusterMap[key].cy = 0;
                  clusterMap[key].count = 0;
              }
              // re-compute clustering centers
              nodes.forEach((node) => {
                  const { data } = node; // node is one of layoutNodes, which is formatted and data field exists
                  const c = clusterMap[data[nodeClusterBy]];
                  if (isNumber(data.x)) {
                      c.cx += data.x;
                  }
                  if (isNumber(data.y)) {
                      c.cy += data.y;
                  }
                  c.count++;
              });
              for (const key in clusterMap) {
                  clusterMap[key].cx /= clusterMap[key].count;
                  clusterMap[key].cy /= clusterMap[key].count;
              }
              // compute the cluster gravity forces
              const clusterGravity = (propsClusterGravity || gravity);
              nodes.forEach((node, j) => {
                  const { id, data } = node;
                  if (!isNumber(data.x) || !isNumber(data.y))
                      return;
                  const c = clusterMap[data[nodeClusterBy]];
                  const distLength = Math.sqrt((data.x - c.cx) * (data.x - c.cx) + (data.y - c.cy) * (data.y - c.cy));
                  const gravityForce = k * clusterGravity;
                  displacements[id].x -= (gravityForce * (data.x - c.cx)) / distLength;
                  displacements[id].y -= (gravityForce * (data.y - c.cy)) / distLength;
              });
          }
          // gravity
          nodes.forEach((node, j) => {
              const { id, data } = node;
              if (!isNumber(data.x) || !isNumber(data.y))
                  return;
              const gravityForce = 0.01 * k * gravity;
              displacements[id].x -= gravityForce * (data.x - center[0]);
              displacements[id].y -= gravityForce * (data.y - center[1]);
              if (dimensions === 3) {
                  displacements[id].z -= gravityForce * (data.z - center[2]);
              }
          });
          // move
          nodes.forEach((node, j) => {
              const { id, data } = node;
              if (isNumber(data.fx) && isNumber(data.fy)) {
                  data.x = data.fx;
                  data.y = data.fy;
                  if (dimensions === 3) {
                      data.z = data.fz;
                  }
                  return;
              }
              if (!isNumber(data.x) || !isNumber(data.y))
                  return;
              const distLength = Math.sqrt(displacements[id].x * displacements[id].x +
                  displacements[id].y * displacements[id].y +
                  (dimensions === 3 ? displacements[id].z * displacements[id].z : 0));
              if (distLength > 0) {
                  // && !n.isFixed()
                  const limitedDist = Math.min(maxDisplace * (speed / SPEED_DIVISOR$1), distLength);
                  calcGraph.mergeNodeData(id, {
                      x: data.x + (displacements[id].x / distLength) * limitedDist,
                      y: data.y + (displacements[id].y / distLength) * limitedDist,
                      z: dimensions === 3
                          ? data.z + (displacements[id].z / distLength) * limitedDist
                          : undefined,
                  });
              }
          });
      }
      applyCalculate(calcGraph, displacements, k, k2) {
          this.calRepulsive(calcGraph, displacements, k2);
          this.calAttractive(calcGraph, displacements, k);
      }
      calRepulsive(calcGraph, displacements, k2) {
          const nodes = calcGraph.getAllNodes();
          nodes.forEach(({ data: v, id: vid }, i) => {
              displacements[vid] = { x: 0, y: 0, z: 0 };
              nodes.forEach(({ data: u, id: uid }, j) => {
                  if (i <= j ||
                      !isNumber(v.x) ||
                      !isNumber(u.x) ||
                      !isNumber(v.y) ||
                      !isNumber(u.y)) {
                      return;
                  }
                  let vecX = v.x - u.x;
                  let vecY = v.y - u.y;
                  let vecZ = this.options.dimensions === 3 ? v.z - u.z : 0;
                  let lengthSqr = vecX * vecX + vecY * vecY + vecZ * vecZ;
                  if (lengthSqr === 0) {
                      lengthSqr = 1;
                      vecX = 0.01;
                      vecY = 0.01;
                      vecZ = 0.01;
                  }
                  const common = k2 / lengthSqr;
                  const dispX = vecX * common;
                  const dispY = vecY * common;
                  const dispZ = vecZ * common;
                  displacements[vid].x += dispX;
                  displacements[vid].y += dispY;
                  displacements[uid].x -= dispX;
                  displacements[uid].y -= dispY;
                  if (this.options.dimensions === 3) {
                      displacements[vid].z += dispZ;
                      displacements[uid].z -= dispZ;
                  }
              });
          });
      }
      calAttractive(calcGraph, displacements, k) {
          const edges = calcGraph.getAllEdges();
          edges.forEach((e) => {
              const { source, target } = e;
              if (!source || !target || source === target) {
                  return;
              }
              const { data: u } = calcGraph.getNode(source);
              const { data: v } = calcGraph.getNode(target);
              if (!isNumber(v.x) ||
                  !isNumber(u.x) ||
                  !isNumber(v.y) ||
                  !isNumber(u.y)) {
                  return;
              }
              const vecX = v.x - u.x;
              const vecY = v.y - u.y;
              const vecZ = this.options.dimensions === 3 ? v.z - u.z : 0;
              const common = Math.sqrt(vecX * vecX + vecY * vecY + vecZ * vecZ) / k;
              const dispX = vecX * common;
              const dispY = vecY * common;
              const dispZ = vecZ * common;
              displacements[source].x += dispX;
              displacements[source].y += dispY;
              displacements[target].x -= dispX;
              displacements[target].y -= dispY;
              if (this.options.dimensions === 3) {
                  displacements[source].z += dispZ;
                  displacements[target].z -= dispZ;
              }
          });
      }
  }

  const DEFAULTS_LAYOUT_OPTIONS$3 = {
      begin: [0, 0],
      preventOverlap: true,
      preventOverlapPadding: 10,
      condense: false,
      rows: undefined,
      cols: undefined,
      position: undefined,
      sortBy: 'degree',
      nodeSize: 30,
      width: 300,
      height: 300,
  };
  /**
   * <zh/> 网格布局
   *
   * <en/> Grid layout
   */
  class GridLayout {
      constructor(options = {}) {
          this.options = options;
          this.id = 'grid';
          this.options = Object.assign(Object.assign({}, DEFAULTS_LAYOUT_OPTIONS$3), options);
      }
      /**
       * Return the positions of nodes and edges(if needed).
       */
      execute(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              return this.genericGridLayout(false, graph, options);
          });
      }
      /**
       * To directly assign the positions to the nodes.
       */
      assign(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              yield this.genericGridLayout(true, graph, options);
          });
      }
      genericGridLayout(assign, graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              const mergedOptions = Object.assign(Object.assign({}, this.options), options);
              const { begin = [0, 0], condense, preventOverlapPadding, preventOverlap, rows: propsRows, cols: propsCols, nodeSpacing: paramNodeSpacing, nodeSize: paramNodeSize, width: propsWidth, height: propsHeight, position, } = mergedOptions;
              let { sortBy } = mergedOptions;
              const nodes = graph.getAllNodes();
              const edges = graph.getAllEdges();
              const n = nodes === null || nodes === void 0 ? void 0 : nodes.length;
              // Need no layout if there is no node.
              if (!n || n === 1) {
                  return handleSingleNodeGraph(graph, assign, begin);
              }
              const layoutNodes = nodes.map((node) => cloneFormatData(node));
              if (
              // `id` should be reserved keyword
              sortBy !== 'id' &&
                  (!isString(sortBy) || layoutNodes[0].data[sortBy] === undefined)) {
                  sortBy = 'degree';
              }
              if (sortBy === 'degree') {
                  layoutNodes.sort((n1, n2) => graph.getDegree(n2.id, 'both') - graph.getDegree(n1.id, 'both'));
              }
              else if (sortBy === 'id') {
                  // sort nodes by ID
                  layoutNodes.sort((n1, n2) => {
                      if (isNumber(n2.id) && isNumber(n1.id)) {
                          return n2.id - n1.id;
                      }
                      return `${n1.id}`.localeCompare(`${n2.id}`);
                  });
              }
              else {
                  // sort nodes by value
                  layoutNodes.sort((n1, n2) => n2.data[sortBy] - n1.data[sortBy]);
              }
              const width = !propsWidth && typeof window !== 'undefined'
                  ? window.innerWidth
                  : propsWidth;
              const height = !propsHeight && typeof window !== 'undefined'
                  ? window.innerHeight
                  : propsHeight;
              const cells = n;
              const rcs = { rows: propsRows, cols: propsCols };
              // if rows or columns were set in self, use those values
              if (propsRows != null && propsCols != null) {
                  rcs.rows = propsRows;
                  rcs.cols = propsCols;
              }
              else if (propsRows != null && propsCols == null) {
                  rcs.rows = propsRows;
                  rcs.cols = Math.ceil(cells / rcs.rows);
              }
              else if (propsRows == null && propsCols != null) {
                  rcs.cols = propsCols;
                  rcs.rows = Math.ceil(cells / rcs.cols);
              }
              else {
                  // otherwise use the automatic values and adjust accordingly	      // otherwise use the automatic values and adjust accordingly
                  // width/height * splits^2 = cells where splits is number of times to split width
                  const splits = Math.sqrt((cells * height) / width);
                  rcs.rows = Math.round(splits);
                  rcs.cols = Math.round((width / height) * splits);
              }
              rcs.rows = Math.max(rcs.rows, 1);
              rcs.cols = Math.max(rcs.cols, 1);
              if (rcs.cols * rcs.rows > cells) {
                  // otherwise use the automatic values and adjust accordingly
                  // if rounding was up, see if we can reduce rows or columns
                  const sm = small(rcs);
                  const lg = large(rcs);
                  // reducing the small side takes away the most cells, so try it first
                  if ((sm - 1) * lg >= cells) {
                      small(rcs, sm - 1);
                  }
                  else if ((lg - 1) * sm >= cells) {
                      large(rcs, lg - 1);
                  }
              }
              else {
                  // if rounding was too low, add rows or columns
                  while (rcs.cols * rcs.rows < cells) {
                      const sm = small(rcs);
                      const lg = large(rcs);
                      // try to add to larger side first (adds less in multiplication)
                      if ((lg + 1) * sm >= cells) {
                          large(rcs, lg + 1);
                      }
                      else {
                          small(rcs, sm + 1);
                      }
                  }
              }
              let cellWidth = condense ? 0 : width / rcs.cols;
              let cellHeight = condense ? 0 : height / rcs.rows;
              if (preventOverlap || paramNodeSpacing) {
                  const nodeSpacing = formatNumberFn(10, paramNodeSpacing);
                  const nodeSize = formatSizeFn(30, paramNodeSize, false);
                  layoutNodes.forEach((node) => {
                      if (!node.data.x || !node.data.y) {
                          // for bb
                          node.data.x = 0;
                          node.data.y = 0;
                      }
                      const oNode = graph.getNode(node.id);
                      const [nodeW, nodeH] = parseSize(nodeSize(oNode) || 30);
                      const p = nodeSpacing !== undefined ? nodeSpacing(node) : preventOverlapPadding;
                      const w = nodeW + p;
                      const h = nodeH + p;
                      cellWidth = Math.max(cellWidth, w);
                      cellHeight = Math.max(cellHeight, h);
                  });
              }
              const cellUsed = {}; // e.g. 'c-0-2' => true
              // to keep track of current cell position
              const rc = { row: 0, col: 0 };
              // get a cache of all the manual positions
              const id2manPos = {};
              for (let i = 0; i < layoutNodes.length; i++) {
                  const node = layoutNodes[i];
                  let rcPos;
                  if (position) {
                      // TODO: not sure the api name
                      rcPos = position(graph.getNode(node.id));
                  }
                  if (rcPos && (rcPos.row !== undefined || rcPos.col !== undefined)) {
                      // must have at least row or col def'd
                      const pos = {
                          row: rcPos.row,
                          col: rcPos.col,
                      };
                      if (pos.col === undefined) {
                          // find unused col
                          pos.col = 0;
                          while (used(cellUsed, pos)) {
                              pos.col++;
                          }
                      }
                      else if (pos.row === undefined) {
                          // find unused row
                          pos.row = 0;
                          while (used(cellUsed, pos)) {
                              pos.row++;
                          }
                      }
                      id2manPos[node.id] = pos;
                      use(cellUsed, pos);
                  }
                  getPos(node, begin, cellWidth, cellHeight, id2manPos, rcs, rc, cellUsed);
              }
              const result = {
                  nodes: layoutNodes,
                  edges,
              };
              if (assign) {
                  layoutNodes.forEach((node) => {
                      graph.mergeNodeData(node.id, {
                          x: node.data.x,
                          y: node.data.y,
                      });
                  });
              }
              return result;
          });
      }
  }
  const small = (rcs, val) => {
      let res;
      const rows = rcs.rows || 5;
      const cols = rcs.cols || 5;
      if (val == null) {
          res = Math.min(rows, cols);
      }
      else {
          const min = Math.min(rows, cols);
          if (min === rcs.rows) {
              rcs.rows = val;
          }
          else {
              rcs.cols = val;
          }
      }
      return res;
  };
  const large = (rcs, val) => {
      let result;
      const usedRows = rcs.rows || 5;
      const usedCols = rcs.cols || 5;
      if (val == null) {
          result = Math.max(usedRows, usedCols);
      }
      else {
          const max = Math.max(usedRows, usedCols);
          if (max === rcs.rows) {
              rcs.rows = val;
          }
          else {
              rcs.cols = val;
          }
      }
      return result;
  };
  const used = (cellUsed, rc) => cellUsed[`c-${rc.row}-${rc.col}`] || false;
  const use = (cellUsed, rc) => (cellUsed[`c-${rc.row}-${rc.col}`] = true);
  const moveToNextCell = (rcs, rc) => {
      const cols = rcs.cols || 5;
      rc.col++;
      if (rc.col >= cols) {
          rc.col = 0;
          rc.row++;
      }
  };
  const getPos = (node, begin, cellWidth, cellHeight, id2manPos, rcs, rc, cellUsed) => {
      let x;
      let y;
      // see if we have a manual position set
      const rcPos = id2manPos[node.id];
      if (rcPos) {
          x = rcPos.col * cellWidth + cellWidth / 2 + begin[0];
          y = rcPos.row * cellHeight + cellHeight / 2 + begin[1];
      }
      else {
          // otherwise set automatically
          while (used(cellUsed, rc)) {
              moveToNextCell(rcs, rc);
          }
          x = rc.col * cellWidth + cellWidth / 2 + begin[0];
          y = rc.row * cellHeight + cellHeight / 2 + begin[1];
          use(cellUsed, rc);
          moveToNextCell(rcs, rc);
      }
      node.data.x = x;
      node.data.y = y;
  };

  const mds = (dimension, distances, linkDistance) => {
      try {
          // square distances
          const M = Matrix.mul(Matrix.pow(distances, 2), -0.5);
          // double centre the rows/columns
          const rowMeans = M.mean('row');
          const colMeans = M.mean('column');
          const totalMean = M.mean();
          M.add(totalMean).subRowVector(rowMeans).subColumnVector(colMeans);
          // take the SVD of the double centred matrix, and return the
          // points from it
          const ret = new SingularValueDecomposition(M);
          const eigenValues = Matrix.sqrt(ret.diagonalMatrix).diagonal();
          return ret.leftSingularVectors.toJSON().map((row) => {
              return Matrix.mul([row], [eigenValues])
                  .toJSON()[0]
                  .splice(0, dimension);
          });
      }
      catch (_a) {
          const res = [];
          for (let i = 0; i < distances.length; i++) {
              const x = Math.random() * linkDistance;
              const y = Math.random() * linkDistance;
              res.push([x, y]);
          }
          return res;
      }
  };

  const SPEED_DIVISOR = 800;
  const DEFAULTS_LAYOUT_OPTIONS$2 = {
      iterations: 10,
      height: 10,
      width: 10,
      speed: 100,
      gravity: 10,
      k: 5,
  };
  const radialNonoverlapForce = (graph, options) => {
      const mergedOptions = Object.assign(Object.assign({}, DEFAULTS_LAYOUT_OPTIONS$2), options);
      const { positions, iterations, width, k, speed = 100, strictRadial, focusIdx, radii = [], nodeSizeFunc, } = mergedOptions;
      const nodes = graph.getAllNodes();
      const disp = [];
      const maxDisplace = width / 10;
      for (let i = 0; i < iterations; i++) {
          positions.forEach((_, k) => {
              disp[k] = { x: 0, y: 0 };
          });
          // 给重叠的节点增加斥力
          getRepulsion(nodes, positions, disp, k, radii, nodeSizeFunc);
          updatePositions(positions, disp, speed, strictRadial, focusIdx, maxDisplace, width, radii);
      }
      return positions;
  };
  const getRepulsion = (nodes, positions, disp, k, radii, nodeSizeFunc) => {
      positions.forEach((v, i) => {
          disp[i] = { x: 0, y: 0 };
          positions.forEach((u, j) => {
              if (i === j) {
                  return;
              }
              // v and u are not on the same circle, return
              if (radii[i] !== radii[j]) {
                  return;
              }
              let vecx = v.x - u.x;
              let vecy = v.y - u.y;
              let vecLength = Math.sqrt(vecx * vecx + vecy * vecy);
              if (vecLength === 0) {
                  vecLength = 1;
                  const sign = i > j ? 1 : -1;
                  vecx = 0.01 * sign;
                  vecy = 0.01 * sign;
              }
              // these two nodes overlap
              if (vecLength < nodeSizeFunc(nodes[i]) / 2 + nodeSizeFunc(nodes[j]) / 2) {
                  const common = (k * k) / vecLength;
                  disp[i].x += (vecx / vecLength) * common;
                  disp[i].y += (vecy / vecLength) * common;
              }
          });
      });
  };
  const updatePositions = (positions, disp, speed, strictRadial, focusIdx, maxDisplace, width, radii) => {
      const maxDisp = maxDisplace || width / 10;
      if (strictRadial) {
          disp.forEach((di, i) => {
              const vx = positions[i].x - positions[focusIdx].x;
              const vy = positions[i].y - positions[focusIdx].y;
              const vLength = Math.sqrt(vx * vx + vy * vy);
              let vpx = vy / vLength;
              let vpy = -vx / vLength;
              const diLength = Math.sqrt(di.x * di.x + di.y * di.y);
              let alpha = Math.acos((vpx * di.x + vpy * di.y) / diLength);
              if (alpha > Math.PI / 2) {
                  alpha -= Math.PI / 2;
                  vpx *= -1;
                  vpy *= -1;
              }
              const tdispLength = Math.cos(alpha) * diLength;
              di.x = vpx * tdispLength;
              di.y = vpy * tdispLength;
          });
      }
      // move
      positions.forEach((n, i) => {
          if (i === focusIdx) {
              return;
          }
          const distLength = Math.sqrt(disp[i].x * disp[i].x + disp[i].y * disp[i].y);
          if (distLength > 0 && i !== focusIdx) {
              const limitedDist = Math.min(maxDisp * (speed / SPEED_DIVISOR), distLength);
              n.x += (disp[i].x / distLength) * limitedDist;
              n.y += (disp[i].y / distLength) * limitedDist;
              if (strictRadial) {
                  let vx = n.x - positions[focusIdx].x;
                  let vy = n.y - positions[focusIdx].y;
                  const nfDis = Math.sqrt(vx * vx + vy * vy);
                  vx = (vx / nfDis) * radii[i];
                  vy = (vy / nfDis) * radii[i];
                  n.x = positions[focusIdx].x + vx;
                  n.y = positions[focusIdx].y + vy;
              }
          }
      });
      return positions;
  };

  const DEFAULTS_LAYOUT_OPTIONS$1 = {
      maxIteration: 1000,
      focusNode: null,
      unitRadius: null,
      linkDistance: 50,
      preventOverlap: false,
      strictRadial: true,
      maxPreventOverlapIteration: 200,
      sortStrength: 10,
  };
  /**
   * <zh/> 径向布局
   *
   * <en/> Radial layout
   */
  class RadialLayout {
      constructor(options = {}) {
          this.options = options;
          this.id = 'radial';
          this.options = Object.assign(Object.assign({}, DEFAULTS_LAYOUT_OPTIONS$1), options);
      }
      /**
       * Return the positions of nodes and edges(if needed).
       */
      execute(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              return this.genericRadialLayout(false, graph, options);
          });
      }
      /**
       * To directly assign the positions to the nodes.
       */
      assign(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              yield this.genericRadialLayout(true, graph, options);
          });
      }
      genericRadialLayout(assign, graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              const mergedOptions = Object.assign(Object.assign({}, this.options), options);
              const { width: propsWidth, height: propsHeight, center: propsCenter, focusNode: propsFocusNode, unitRadius: propsUnitRadius, nodeSize, nodeSpacing, strictRadial, preventOverlap, maxPreventOverlapIteration, sortBy, linkDistance = 50, sortStrength = 10, maxIteration = 1000, } = mergedOptions;
              const nodes = graph.getAllNodes();
              const edges = graph.getAllEdges();
              const width = !propsWidth && typeof window !== 'undefined'
                  ? window.innerWidth
                  : propsWidth;
              const height = !propsHeight && typeof window !== 'undefined'
                  ? window.innerHeight
                  : propsHeight;
              const center = (!propsCenter ? [width / 2, height / 2] : propsCenter);
              if (!(nodes === null || nodes === void 0 ? void 0 : nodes.length) || nodes.length === 1) {
                  return handleSingleNodeGraph(graph, assign, center);
              }
              let focusNode = nodes[0];
              if (isString(propsFocusNode)) {
                  for (let i = 0; i < nodes.length; i++) {
                      if (nodes[i].id === propsFocusNode) {
                          focusNode = nodes[i];
                          break;
                      }
                  }
              }
              else {
                  focusNode = propsFocusNode || nodes[0];
              }
              // the index of the focusNode in data
              const focusIndex = getIndexById(nodes, focusNode.id);
              // the graph-theoretic distance (shortest path distance) matrix
              const adjMatrix = getAdjMatrix({ nodes, edges });
              const distances = floydWarshall(adjMatrix);
              const maxDistance = maxToFocus(distances, focusIndex);
              // replace first node in unconnected component to the circle at (maxDistance + 1)
              handleInfinity(distances, focusIndex, maxDistance + 1);
              // the shortest path distance from each node to focusNode
              const focusNodeD = distances[focusIndex];
              let semiWidth = width - center[0] > center[0] ? center[0] : width - center[0];
              let semiHeight = height - center[1] > center[1] ? center[1] : height - center[1];
              if (semiWidth === 0) {
                  semiWidth = width / 2;
              }
              if (semiHeight === 0) {
                  semiHeight = height / 2;
              }
              // the maxRadius of the graph
              const maxRadius = Math.min(semiWidth, semiHeight);
              const maxD = Math.max(...focusNodeD);
              // the radius for each nodes away from focusNode
              const radii = [];
              const unitRadius = !propsUnitRadius ? maxRadius / maxD : propsUnitRadius;
              focusNodeD.forEach((value, i) => {
                  radii[i] = value * unitRadius;
              });
              const idealDistances = eIdealDisMatrix(nodes, distances, linkDistance, radii, unitRadius, sortBy, sortStrength);
              // the weight matrix, Wij = 1 / dij^(-2)
              const weights = getWeightMatrix(idealDistances);
              // the initial positions from mds, move the graph to origin, centered at focusNode
              const mdsResult = mds(linkDistance, idealDistances, linkDistance);
              let positions = mdsResult.map(([x, y]) => ({
                  x: (isNaN(x) ? Math.random() * linkDistance : x) -
                      mdsResult[focusIndex][0],
                  y: (isNaN(y) ? Math.random() * linkDistance : y) -
                      mdsResult[focusIndex][1],
              }));
              this.run(maxIteration, positions, weights, idealDistances, radii, focusIndex);
              let nodeSizeFunc;
              // stagger the overlapped nodes
              if (preventOverlap) {
                  nodeSizeFunc = formatNodeSizeToNumber(nodeSize, nodeSpacing);
                  const nonoverlapForceParams = {
                      nodes,
                      nodeSizeFunc,
                      positions,
                      radii,
                      height,
                      width,
                      strictRadial: Boolean(strictRadial),
                      focusIdx: focusIndex,
                      iterations: maxPreventOverlapIteration || 200,
                      k: positions.length / 4.5,
                  };
                  positions = radialNonoverlapForce(graph, nonoverlapForceParams);
              }
              // move the graph to center
              const layoutNodes = [];
              positions.forEach((p, i) => {
                  const cnode = cloneFormatData(nodes[i]);
                  cnode.data.x = p.x + center[0];
                  cnode.data.y = p.y + center[1];
                  layoutNodes.push(cnode);
              });
              if (assign) {
                  layoutNodes.forEach((node) => graph.mergeNodeData(node.id, {
                      x: node.data.x,
                      y: node.data.y,
                  }));
              }
              const result = {
                  nodes: layoutNodes,
                  edges,
              };
              return result;
          });
      }
      run(maxIteration, positions, weights, idealDistances, radii, focusIndex) {
          for (let i = 0; i <= maxIteration; i++) {
              const param = i / maxIteration;
              this.oneIteration(param, positions, radii, idealDistances, weights, focusIndex);
          }
      }
      oneIteration(param, positions, radii, distances, weights, focusIndex) {
          const vparam = 1 - param;
          positions.forEach((v, i) => {
              // v
              const originDis = getEuclideanDistance(v, { x: 0, y: 0 });
              const reciODis = originDis === 0 ? 0 : 1 / originDis;
              if (i === focusIndex) {
                  return;
              }
              let xMolecule = 0;
              let yMolecule = 0;
              let denominator = 0;
              positions.forEach((u, j) => {
                  // u
                  if (i === j) {
                      return;
                  }
                  // the euclidean distance between v and u
                  const edis = getEuclideanDistance(v, u);
                  const reciEdis = edis === 0 ? 0 : 1 / edis;
                  const idealDis = distances[j][i];
                  // same for x and y
                  denominator += weights[i][j];
                  // x
                  xMolecule += weights[i][j] * (u.x + idealDis * (v.x - u.x) * reciEdis);
                  // y
                  yMolecule += weights[i][j] * (u.y + idealDis * (v.y - u.y) * reciEdis);
              });
              const reciR = radii[i] === 0 ? 0 : 1 / radii[i];
              denominator *= vparam;
              denominator += param * reciR * reciR;
              // x
              xMolecule *= vparam;
              xMolecule += param * reciR * v.x * reciODis;
              v.x = xMolecule / denominator;
              // y
              yMolecule *= vparam;
              yMolecule += param * reciR * v.y * reciODis;
              v.y = yMolecule / denominator;
          });
      }
  }
  const eIdealDisMatrix = (nodes, distances, linkDistance, radii, unitRadius, sortBy, sortStrength) => {
      if (!nodes)
          return [];
      const result = [];
      if (distances) {
          // cache the value of field sortBy for nodes to avoid dupliate calculation
          const sortValueCache = {};
          distances.forEach((row, i) => {
              const newRow = [];
              row.forEach((v, j) => {
                  var _a, _b;
                  if (i === j) {
                      newRow.push(0);
                  }
                  else if (radii[i] === radii[j]) {
                      // i and j are on the same circle
                      if (sortBy === 'data') {
                          // sort the nodes on the same circle according to the ordering of the data
                          newRow.push((v * (Math.abs(i - j) * sortStrength)) / (radii[i] / unitRadius));
                      }
                      else if (sortBy) {
                          // sort the nodes on the same circle according to the attributes
                          let iValue;
                          let jValue;
                          if (sortValueCache[nodes[i].id]) {
                              iValue = sortValueCache[nodes[i].id];
                          }
                          else {
                              const value = (sortBy === 'id'
                                  ? nodes[i].id
                                  : (_a = nodes[i].data) === null || _a === void 0 ? void 0 : _a[sortBy]) || 0;
                              if (isString(value)) {
                                  iValue = value.charCodeAt(0);
                              }
                              else {
                                  iValue = value;
                              }
                              sortValueCache[nodes[i].id] = iValue;
                          }
                          if (sortValueCache[nodes[j].id]) {
                              jValue = sortValueCache[nodes[j].id];
                          }
                          else {
                              const value = (sortBy === 'id'
                                  ? nodes[j].id
                                  : (_b = nodes[j].data) === null || _b === void 0 ? void 0 : _b[sortBy]) || 0;
                              if (isString(value)) {
                                  jValue = value.charCodeAt(0);
                              }
                              else {
                                  jValue = value;
                              }
                              sortValueCache[nodes[j].id] = jValue;
                          }
                          newRow.push((v * (Math.abs(iValue - jValue) * sortStrength)) /
                              (radii[i] / unitRadius));
                      }
                      else {
                          newRow.push((v * linkDistance) / (radii[i] / unitRadius));
                      }
                  }
                  else {
                      // i and j are on different circles
                      const link = (linkDistance + unitRadius) / 2;
                      newRow.push(v * link);
                  }
              });
              result.push(newRow);
          });
      }
      return result;
  };
  const getWeightMatrix = (idealDistances) => {
      const rows = idealDistances.length;
      const cols = idealDistances[0].length;
      const result = [];
      for (let i = 0; i < rows; i++) {
          const row = [];
          for (let j = 0; j < cols; j++) {
              if (idealDistances[i][j] !== 0) {
                  row.push(1 / (idealDistances[i][j] * idealDistances[i][j]));
              }
              else {
                  row.push(0);
              }
          }
          result.push(row);
      }
      return result;
  };
  const getIndexById = (array, id) => {
      let index = -1;
      array.forEach((a, i) => {
          if (a.id === id) {
              index = i;
          }
      });
      return Math.max(index, 0);
  };
  const handleInfinity = (matrix, focusIndex, step) => {
      const length = matrix.length;
      // 遍历 matrix 中遍历 focus 对应行
      for (let i = 0; i < length; i++) {
          // matrix 关注点对应行的 Inf 项
          if (matrix[focusIndex][i] === Infinity) {
              matrix[focusIndex][i] = step;
              matrix[i][focusIndex] = step;
              // 遍历 matrix 中的 i 行，i 行中非 Inf 项若在 focus 行为 Inf，则替换 focus 行的那个 Inf
              for (let j = 0; j < length; j++) {
                  if (matrix[i][j] !== Infinity && matrix[focusIndex][j] === Infinity) {
                      matrix[focusIndex][j] = step + matrix[i][j];
                      matrix[j][focusIndex] = step + matrix[i][j];
                  }
              }
          }
      }
      // 处理其他行的 Inf。根据该行对应点与 focus 距离以及 Inf 项点 与 focus 距离，决定替换值
      for (let i = 0; i < length; i++) {
          if (i === focusIndex) {
              continue;
          }
          for (let j = 0; j < length; j++) {
              if (matrix[i][j] === Infinity) {
                  let minus = Math.abs(matrix[focusIndex][i] - matrix[focusIndex][j]);
                  minus = minus === 0 ? 1 : minus;
                  matrix[i][j] = minus;
              }
          }
      }
  };
  const maxToFocus = (matrix, focusIndex) => {
      let max = 0;
      for (let i = 0; i < matrix[focusIndex].length; i++) {
          if (matrix[focusIndex][i] === Infinity) {
              continue;
          }
          max = matrix[focusIndex][i] > max ? matrix[focusIndex][i] : max;
      }
      return max;
  };

  const DEFAULTS_LAYOUT_OPTIONS = {
      center: [0, 0],
      width: 300,
      height: 300,
  };
  /**
   * <zh/> 随机布局
   *
   * <en/> Random layout
   */
  class RandomLayout {
      constructor(options = {}) {
          this.options = options;
          this.id = 'random';
          this.options = Object.assign(Object.assign({}, DEFAULTS_LAYOUT_OPTIONS), options);
      }
      /**
       * Return the positions of nodes and edges(if needed).
       */
      execute(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              return this.genericRandomLayout(false, graph, options);
          });
      }
      /**
       * To directly assign the positions to the nodes.
       */
      assign(graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              yield this.genericRandomLayout(true, graph, options);
          });
      }
      genericRandomLayout(assign, graph, options) {
          return __awaiter(this, void 0, void 0, function* () {
              const mergedOptions = Object.assign(Object.assign({}, this.options), options);
              const { center: propsCenter, width: propsWidth, height: propsHeight, } = mergedOptions;
              const nodes = graph.getAllNodes();
              const layoutScale = 0.9;
              const width = !propsWidth && typeof window !== 'undefined'
                  ? window.innerWidth
                  : propsWidth;
              const height = !propsHeight && typeof window !== 'undefined'
                  ? window.innerHeight
                  : propsHeight;
              const center = !propsCenter
                  ? [width / 2, height / 2]
                  : propsCenter;
              const layoutNodes = [];
              if (nodes) {
                  nodes.forEach((node) => {
                      layoutNodes.push({
                          id: node.id,
                          data: {
                              x: (Math.random() - 0.5) * layoutScale * width + center[0],
                              y: (Math.random() - 0.5) * layoutScale * height + center[1],
                          },
                      });
                  });
              }
              if (assign) {
                  layoutNodes.forEach((node) => graph.mergeNodeData(node.id, {
                      x: node.data.x,
                      y: node.data.y,
                  }));
              }
              const result = {
                  nodes: layoutNodes,
                  edges: graph.getAllEdges(),
              };
              return result;
          });
      }
  }

  const registry = {
      circular: CircularLayout,
      concentric: ConcentricLayout,
      mds: MDSLayout,
      random: RandomLayout,
      grid: GridLayout,
      radial: RadialLayout,
      force: ForceLayout,
      d3force: D3ForceLayout,
      'd3-force-3d': D3Force3DLayout,
      fruchterman: FruchtermanLayout,
      forceAtlas2: ForceAtlas2Layout,
      dagre: DagreLayout,
      antvDagre: AntVDagreLayout,
      comboCombined: ComboCombinedLayout,
  };

  let currentLayout;
  const obj = {
      stopLayout() {
          if (currentLayout === null || currentLayout === void 0 ? void 0 : currentLayout.stop) {
              currentLayout.stop();
          }
      },
      calculateLayout(payload, transferables) {
          return __awaiter(this, void 0, void 0, function* () {
              const { layout: { id, options, iterations }, nodes, edges, } = payload;
              // Sync graph on the worker side.
              // TODO: Use transferable objects like ArrayBuffer for nodes & edges,
              // in which case we don't need the whole graph.
              // @see https://github.com/graphology/graphology/blob/master/src/layout-noverlap/webworker.tpl.js#L32
              const graph = new Graph({
                  nodes,
                  edges,
              });
              /**
               * Create layout instance on the worker side.
               */
              const layoutCtor = registry[id];
              if (layoutCtor) {
                  currentLayout = new layoutCtor(options);
              }
              else {
                  throw new Error(`Unknown layout id: ${id}`);
              }
              let positions = yield currentLayout.execute(graph);
              if (isLayoutWithIterations(currentLayout)) {
                  currentLayout.stop();
                  positions = currentLayout.tick(iterations);
              }
              return [positions, transferables];
          });
      },
  };
  expose(obj);

})();
