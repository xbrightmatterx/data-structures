var HashTable = function(){
  this._limit = 8;
  this._storage = LimitedArray(this._limit);
};

HashTable.prototype.tbd = function() {

};

HashTable.prototype.resize = function() {
  var bucket;
  var newStorage;
  var tuple;
  var newIndex;
  var limit = this._limit;

  var expandThreshold = 0.75;
  var contractThreshold = 0.25;

  var tupleCount = 0;
  this._storage.each(function (bucket, index, collection) {
    if (bucket) {
      for(var i = 0; i < bucket.length; i++) {
        tupleCount++;
      }
    }
  });

  if (tupleCount > expandThreshold*limit) {
    newStorage = LimitedArray(limit * 2);

    this._storage.each(function (bucket, index, collection) {
      if (bucket) {
        for (var j = 0; j < bucket.length; j++) {  
          tuple = bucket[j];
          newIndex = getIndexBelowMaxForKey(tuple[0], limit * 2);
          newStorage.set(newIndex, tuple);
        }
      }
    });
    this._limit *= 2;
    this._storage = newStorage;
  }

  else if ((tupleCount < contractThreshold*limit) && tupleCount > 3) {
    newStorage = LimitedArray(limit / 2);

    this._storage.each(function (bucket, index, collection) {
      if (bucket) {
        for (var k = 0; k < bucket.length; k++) {
          tuple = bucket[k];
          newIndex = getIndexBelowMaxForKey(tuple[0], limit / 2);
          newStorage.set(newIndex, tuple);
        }
      }
    });

    this._limit /= 2;
    this._storage = newStorage;
  }
};

HashTable.prototype.insert = function(k, v){
  var i = getIndexBelowMaxForKey(k, this._limit);

  if (!this._storage.get(i)) {
    this._storage.set(i, []);
  }

  var bucket = this._storage.get(i);

  var newTuple = [k,v];

  for(var j = 0; j < bucket.length; j++) {
    if(bucket[j][0] === k) {
      bucket[j][1] = v;
      return;
    }
  }
  bucket.push(newTuple);
  this.resize();
};

HashTable.prototype.retrieve = function(k){
  var i = getIndexBelowMaxForKey(k, this._limit);
  var bucket = this._storage.get(i);
  for(var j = 0; j < bucket.length; j++) {
    if(bucket[j][0] === k) {
      return bucket[j][1];
    }
  }
  return null;
};

HashTable.prototype.remove = function(k){
  var i = getIndexBelowMaxForKey(k, this._limit);
  var bucket = this._storage.get(i);
  if (bucket) {
    for (var j = 0; j < bucket.length; j++) {
        if (bucket[j][0] === k) {
          bucket.splice(j,1);
          this.resize();
          return;
      }
    }
  }
};

/*
 * Complexity: What is the time complexity of the above functions?
 */
