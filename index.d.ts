/**
 * @link https://github.com/jagi/meteor-astronomy
 * @example
 * import { Class } from 'meteor/jagi:astronomy';
 */
declare module 'meteor/jagi:astronomy' {
  import { Mongo } from 'meteor/mongo';
  interface ValidateResolveErrorParamArgs {
    className: string;
    doc: any;
    name: string;
    nestedName: string;
    value: any;
    param: any;
  }

  interface ValidatorOption {
    type: string;
    param: any;
  }

  interface ClassSetOption {
    clone?: boolean;
  }

  interface ResultCallback {
    (err: any, result?: any): void;
  }

  interface ClassFieldOption {
    type: any;
    validators?: ValidatorOption[];
    'default'?: any;
    transient?: boolean;
    immutable?: boolean;
    optional?: boolean;
    index?: number | string;
  }

  interface AstronomyEvent<T> {
    // If it was initiated on the server that it’s “trusted” if on the client then it’s not and we should validate user’s permissions
    trusted: boolean;
    currentTarget: T;
    target: T;
    type: string;
    timeStamp: number;
    stopPropagation: () => void;
    stopImmediatePropagation: () => void;
    preventDefault: () => void;
    // only beforeFind / afterFind
    selector?: any;
    // only beforeFind / afterFind
    options?: any;
    // only afterFind / afterFind
    result?: any;
  }

  interface EventCallback<T> {
    (event: AstronomyEvent<T>): void;
  }

  interface ClassDefinition<T> {
    name?: string;
    fields?: { [key: string]: ClassFieldOption | any };
    collection?: Mongo.Collection<T>;
    identifiers?: any;
    behaviors?: any;
    indexes?: { [key: string]: { fields: { [key: string]: number | string }; options?: any } };
    secured?: boolean | { update?: boolean; remove?: boolean; insert?: boolean; };
    helpers?: any,
    methods?: any,
    meteorMethods?: any,
    events?: {
      beforeInit?: EventCallback<T> | EventCallback<T>[];
      afterInit?: EventCallback<T> | EventCallback<T>[];
      beforeSave?: EventCallback<T> | EventCallback<T>[];
      afterSave?: EventCallback<T> | EventCallback<T>[];
      beforeInsert?: EventCallback<T> | EventCallback<T>[];
      afterInsert?: EventCallback<T> | EventCallback<T>[];
      beforeUpdate?: EventCallback<T> | EventCallback<T>[];
      afterUpdate?: EventCallback<T> | EventCallback<T>[];
      beforeRemove?: EventCallback<T> | EventCallback<T>[];
      afterRemove?: EventCallback<T> | EventCallback<T>[];
      beforeFind?: EventCallback<T> | EventCallback<T>[];
      afterFind?: EventCallback<T> | EventCallback<T>[];
      toJSONValue?: EventCallback<T> | EventCallback<T>[];
      fromJSONValue?: EventCallback<T> | EventCallback<T>[];
    }
  }

  interface TypeOption {
    name: string;
    'class': any;
    cast?: Function;
    validate?: Function;
  }

  interface ValidatorDefinition {
    name: string;
    parseParam?: (param: any) => void;
    isValid?: (
      param: {
        className: string;
        doc: any;
        name: string;
        nestedName?: string;
        value: any;
        param: any;
        validator: string
      }) => boolean;
    validate?: (options: ValidateParam) => void;
    resolveError?: (param: ValidateResolveErrorParamArgs) => string;
  }

  interface ValidateParam {
    doc: Class;
    name: string;
    nestedName?: string;
    value: any;
    param: any;
    resolveParam?: Function;
    message?: string;
    resolveError?: (param: ValidateResolveErrorParamArgs) => string;
  }

  interface Field {
    getDefault(): any;
    getOptional(doc: any): any;
    cast(value: any): any;
    validate(args: any): any;
    resolveValue(rawDoc: any): any;
  }

  interface FieldStatic {
    new (
      definition: {
        name: string;
        type: string;
        'default': Function | any;
        optional?: Function | boolean;
        immutable?: boolean;
        transient?: boolean;
        resolve?: Function;
      }): Field;
  }

  interface Class {
    _id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    typeName?(): string;
    toJSONValue?(args: any): any;
    save?(args?: any | ResultCallback, callback?: ResultCallback): any;
    remove?(args?: { simulation?: boolean } | ResultCallback, callback?: ResultCallback): any;
    reload?(): void;
    copy?(save?: boolean): this;
    set?(field: any, value?: any | ClassSetOption, options?: ClassSetOption): void;
    getModifier?(): any;
    getModified?(): string[];
    getModifiedValues?(options?: { old: boolean; raw: boolean }): { [name: string]: any };
    isModified?(pattern?: any): boolean;
    get?(fieldName?: string | string[]): any;
    getFieldNames?(options?: { transient?: boolean, immutable?: boolean }): string[];
    raw?(fieldName?: string | string[]): any;
    validate?(args?: { fields?: string[]; stopOnFirstError?: boolean; simulation?: boolean } | ResultCallback, callback?: ResultCallback): any;
    validateAll?(fieldName?: string | string[]): any;
  }

  interface ClassStatic {
    create<T>(definition: ClassDefinition<T>): ClassStaticByCreated<T>;
  }

  interface ClassStaticByCreated<T> extends Mongo.Collection<T> {
    new(rawDoc?: any, options?: any): T;
    getName(): string;
    getParent(): ClassStaticByCreated<any>;
    getChildren(): ClassStaticByCreated<any>;
    inherit(definition: ClassDefinition<T>): ClassStaticByCreated<any>;
    extend(extendDefinition: ClassDefinition<T>, onlyModules?: any): void;
    get(className: string): ClassStaticByCreated<any>;
    has(className: string): boolean;
    includes(classTarget: ClassStaticByCreated<any>): boolean;
    isParentOf(classTarget: ClassStaticByCreated<any>): boolean;
    isChildOf(classTarget: ClassStaticByCreated<any>): boolean;
    getFieldsNames(): string[];
    getField(fieldName: string): any;
    getFields(): Field[];
    getObjectFields(): Field[];
    getListFields(classOnly: boolean): Field[];
    getCollection(): Mongo.Collection<T>;
    getScalarFields(): Field[];
    hasField(fieldName: string): boolean;
    getResolveError(): ValidateResolveErrorParamArgs;
    getValidationOrder(): string[];
    getValidators(fieldName?: string): Validator[];
    validate(rawDoc: any, args?: { fields?: string[]; stopOnFirstError?: boolean; simulation?: boolean } | ResultCallback, callback?: ResultCallback): any;
    validateAll(rawDoc: any, args?: { fields?: string[]; stopOnFirstError?: boolean; simulation?: boolean } | ResultCallback, callback?: ResultCallback): boolean;
    getCheckPattern(): any;
  }

  interface EnumStatic {
    create(option: { name: string; identifiers: any[] | { [key: string]: any }; }): Enum;
  }

  interface Enum {
    getIdentifiers(): any[];
    getIdentifier(value: any): any;
  }

  interface TypeStatic {
    new(option: TypeOption): Type;
    create(option: TypeOption): void;
    get(name: string): Type;
    has(name: string): boolean;
    find(Class: any): Type;
  }

  interface Type {
    cast(value: any): any;
    validate(doc: any, fieldName: string): boolean;
  }

  interface ValidatorStatic {
    new(definition: ValidatorDefinition): Validator;
    create(definition: ValidatorDefinition): (options: ValidateParam) => void;
  }

  interface Validator {
    validate(validateParam: ValidateParam): void;
  }

  interface ValidationErrorStatic {
    is(err: any): boolean;
  }

  interface Event {
    preventDefault();
    stopPropagation();
    stopImmediatePropagation();
  }

  interface EventStatic {
    new(type: string, data: any): Event;
  }

  interface BehaviorStatic {
    new(options?: any): Behavior;
    create(definition: { name: string; }): BehaviorStatic;
    get(behaviorName: string): BehaviorStatic;
    has(behaviorName: string): boolean;
  }

  interface Behavior {
    createClassDefinition(): void;
    apply(clazz: Class): void;
  }

  interface ModuleStatic {
    new(
      definition: {
        name: string;
        onInitSchema?: Function;
        onInitDefinition?: Function;
        onInitClass?: Function;
        onParseDefinition?: Function;
        onApplyDefinition?: Function;
        onMergeDefinitions?: Function;
        utils?: { [methodName: string]: Function };
      }): Module;
    create(definition: any): ModuleStatic;
    get(moduleName: string): ModuleStatic;
    forEach(iteratee: Function): void;
  }

  interface Module {
    onInitSchema(schema: any, className: string): void;
    onInitDefinition(definition: any, className: string): void;
    onInitClass(clazz: Class, className: string): void;
    onParseDefintion(parseDefinition: any, definition: any, className: string): void;
    onApplyDefintion(clazz: Class, definition: any, className: string): void;
    onMergeDefintion(targetDefinition: any, sourceDefinition: any, className: string): void;
  }

  const Module: ModuleStatic;
  const Class: ClassStatic;
  const Enum: EnumStatic;
  const Type: TypeStatic;
  const Field: FieldStatic;
  const ScalarField: FieldStatic;
  const ObjectField: FieldStatic;
  const ListField: FieldStatic;
  const Behavior: BehaviorStatic;
  const Validator: ValidatorStatic;
  const Validators: { [type: string]: (options: any) => void };
  const ValidationError: ValidationErrorStatic;
  const Event: EventStatic;
  const reservedKeywords: string[];
}
