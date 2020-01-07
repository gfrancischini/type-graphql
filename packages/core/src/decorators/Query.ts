import TypedMethodDecorator from "@src/interfaces/TypedMethodDecorator";
import MetadataStorage from "@src/metadata/storage/MetadataStorage";
import {
  Nameable,
  ExplicitTypeable,
  Descriptionable,
  Nullable,
} from "@src/decorators/types";
import ExplicitTypeFn from "@src/interfaces/ExplicitTypeFn";
import {
  parseDecoratorParameters,
  parseStringOrSymbol,
} from "@src/decorators/helpers";
import ClassType from "@src/interfaces/ClassType";

export interface QueryOptions
  extends Nameable,
    Descriptionable,
    Nullable,
    ExplicitTypeable {}

/**
 * Decorator used to register the class method
 * as an field of "Query" object type in GraphQL schema, e.g.:
 *
 * ```graphql
 * type Query {
 *  myMethod: SomeType!
 * }
 * ```
 */
export default function Query(options?: QueryOptions): TypedMethodDecorator;
export default function Query(
  /**
   * Function that returns an explicit type to overwrite
   * or enhance the built-in TypeScript type reflection system,
   * e.g. `@Query(returns => [String])`
   */
  explicitTypeFn: ExplicitTypeFn,
  options?: QueryOptions,
): TypedMethodDecorator;
export default function Query(
  maybeExplicitTypeFnOrOptions?: ExplicitTypeFn | QueryOptions,
  maybeOptions?: QueryOptions,
): TypedMethodDecorator {
  return (prototype, propertyKey) => {
    const target = prototype.constructor as ClassType; // FIXME: fix typed decorator signature
    const { explicitTypeFn, options = {} } = parseDecoratorParameters(
      maybeExplicitTypeFnOrOptions,
      maybeOptions,
      {
        target,
        propertyKey,
      },
    );
    MetadataStorage.get().collectQueryMetadata({
      target,
      propertyKey,
      schemaName: options.schemaName ?? parseStringOrSymbol(propertyKey),
      description: options.description,
      nullable: options.nullable,
      explicitTypeFn,
    });
  };
}