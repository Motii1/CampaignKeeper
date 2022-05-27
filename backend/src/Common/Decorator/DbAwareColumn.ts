import { Column, ColumnOptions, ColumnType } from 'typeorm';
import { config } from '../../Application/Config/Config';
import { NodeEnv } from '../Type/NodeEnv';

const sqlServerSqliteTypeMapping: Record<string, ColumnType> = {
  varbinary: 'blob',
};

export const resolveDbType = (sqlServerType: ColumnType): ColumnType => {
  const isTestEnv = config.nodeEnv === NodeEnv.Test;
  const mappingIncludeKey = (sqlServerType as string) in sqlServerSqliteTypeMapping;
  if (isTestEnv && mappingIncludeKey) {
    return sqlServerSqliteTypeMapping[sqlServerType.toString()];
  }
  return sqlServerType;
};

export const DbAwareColumn = (columnOptions: ColumnOptions): PropertyDecorator => {
  const parsedColumnOptions = {
    ...columnOptions,
  };
  if (columnOptions.type) {
    parsedColumnOptions.type = resolveDbType(columnOptions.type);
  }
  delete parsedColumnOptions.length;
  return Column(parsedColumnOptions);
};
