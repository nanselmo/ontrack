interface ListData<T> {
  records: T[]
  getKey: (record: T) => string
  getDisplayText: (record: T) => string
}

export default ListData;
