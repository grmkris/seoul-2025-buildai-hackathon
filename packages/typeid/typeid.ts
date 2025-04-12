import { TypeID, typeid, toUUID, getType, fromString } from "typeid-js";
import { z } from "zod";

const typeIdLength = 26;

export const idTypesMapNameToPrefix = {
  // Forms module prefixes
  user: "usr",
  form: "frm",
  formField: "fld",
  formSubmission: "fsub",
  formSubmissionData: "sbd",
  formTemplate: "tpl",
  contentType: "ct",
  cmsContent: "cms",
  content: "cnt",
  contentField: "cf",
  entityLink: "el",

  // Added from id.schema.ts (with necessary renames)
  customer: "cst",
  customerAddress: "cstaddr",
  workspace: "wsp",
  note: "nte",
  document: "doc",
  request: "req",
  dbOperation: "dbop",
  s3Operation: "s3op",
  redisOperation: "rdop",
  organization: "org",
  session: "ses",
  account: "acc",
  verification: "ver",
  passkey: "psk",
  member: "mbr",
  invitation: "ivt",
  apikey: "apk",
  conversation: "cnv",
  message: "msg",
  conversationItem: "cvi",
  task: "tsk",
  timeEntry: "tme",
  productCategory: "pcat",
  productVariant: "prv",
  digitalProduct: "dpr",
  subscriptionPlanProduct: "spr",
  inventoryLog: "invl",
  product: "prd",
  order: "ord",
  noteOrder: "nor",
  discountCode: "dsc",
  inventoryMovement: "imv",
  subscription: "sbs",
  productMedia: "pmd",
  store: "str",
  storeItem: "sit",
  storeSchedule: "ssc",
  payment: "pay",
  fulfillment: "ful",
  taxRate: "tax",
  shippingMethod: "shp",
  tag: "tag",
  productTag: "ptg",
  currency: "cur",
  paymentMethod: "pym",
  cart: "crt",
  cartItem: "cri",
  orderItem: "oit",
  inventoryLocation: "iloc",
  unitOfMeasure: "uom",
  productVariantOption: "prvopt",
  language: "lng",
  paymentIntent: "pi",
} as const;

type IdTypesMapNameToPrefix = typeof idTypesMapNameToPrefix;

type IdTypesMapPrefixToName = {
  [K in keyof IdTypesMapNameToPrefix as IdTypesMapNameToPrefix[K]]: K;
};

const idTypesMapPrefixToName = Object.fromEntries(
  Object.entries(idTypesMapNameToPrefix).map(([x, y]) => [y, x]),
) as IdTypesMapPrefixToName;

export type IdTypePrefixNames = keyof typeof idTypesMapNameToPrefix;
export type TypeId<T extends IdTypePrefixNames> =
  `${(typeof idTypesMapNameToPrefix)[T]}_${string}`;

export const typeIdValidator = <const T extends IdTypePrefixNames>(prefix: T) =>
  z
    .string()
    .startsWith(`${idTypesMapNameToPrefix[prefix]}_`)
    .length(typeIdLength + idTypesMapNameToPrefix[prefix].length + 1) // suffix length + prefix length + underscore
    .transform(
      (input) =>
        TypeID.fromString(input)
          .asType(idTypesMapNameToPrefix[prefix])
          .toString() as TypeId<T>,
    );

export const typeIdGenerator = <const T extends IdTypePrefixNames>(prefix: T) =>
  typeid(idTypesMapNameToPrefix[prefix]).toString() as TypeId<T>;

export const typeIdFromUUID = <const T extends IdTypePrefixNames>(
  prefix: T,
  uuid: string,
) => {
  // Use the mapping to get the actual prefix string from the name
  const actualPrefix = idTypesMapNameToPrefix[prefix];
  // Then use the actual prefix with TypeID.fromUUID
  return TypeID.fromUUID(actualPrefix, uuid).toString() as TypeId<T>;
};

export const typeIdToUUID = <const T extends IdTypePrefixNames>(
  input: TypeId<T>,
) => {
  console.log("input", input);
  const id = fromString(input);
  return {
    uuid: toUUID(id).toString(),
    prefix: getType(id),
  };
};

export const validateTypeId = <const T extends IdTypePrefixNames>(
  prefix: T,
  data: unknown,
): data is TypeId<T> => typeIdValidator(prefix).safeParse(data).success;

export const inferTypeId = <T extends keyof IdTypesMapPrefixToName>(
  input: `${T}_${string}`,
) =>
  idTypesMapPrefixToName[
    TypeID.fromString(input).getType() as T
  ] as unknown as T;


export const WorkspaceId = typeIdValidator("workspace");
export type WorkspaceId = z.infer<typeof WorkspaceId>;
export const OrganizationId = typeIdValidator("organization");
export type OrganizationId = z.infer<typeof OrganizationId>;
export const MemberId = typeIdValidator("member");
export type MemberId = z.infer<typeof MemberId>;
export const UserId = typeIdValidator("user");
export type UserId = z.infer<typeof UserId>;
export const ProductId = typeIdValidator("product");
export type ProductId = z.infer<typeof ProductId>;
export const ProductVariantId = typeIdValidator("productVariant");
export type ProductVariantId = z.infer<typeof ProductVariantId>;
export const ProductVariantOptionId = typeIdValidator("productVariantOption");
export type ProductVariantOptionId = z.infer<typeof ProductVariantOptionId>;
export const UnitOfMeasureId = typeIdValidator("unitOfMeasure");
export type UnitOfMeasureId = z.infer<typeof UnitOfMeasureId>;
export const CurrencyId = typeIdValidator("currency");
export type CurrencyId = z.infer<typeof CurrencyId>;

export const CustomerId = typeIdValidator("customer");
export type CustomerId = z.infer<typeof CustomerId>;
export const CustomerAddressId = typeIdValidator("customerAddress");
export type CustomerAddressId = z.infer<typeof CustomerAddressId>;

export const DocumentId = typeIdValidator("document");  
export type DocumentId = z.infer<typeof DocumentId>;
export const RequestId = typeIdValidator("request");
export type RequestId = z.infer<typeof RequestId>;
export const DbOperationId = typeIdValidator("dbOperation");
export type DbOperationId = z.infer<typeof DbOperationId>;
export const S3OperationId = typeIdValidator("s3Operation");
export type S3OperationId = z.infer<typeof S3OperationId>;
export const RedisOperationId = typeIdValidator("redisOperation");
export type RedisOperationId = z.infer<typeof RedisOperationId>;

export const ConversationId = typeIdValidator("conversation");
export type ConversationId = z.infer<typeof ConversationId>;
export const MessageId = typeIdValidator("message");
export type MessageId = z.infer<typeof MessageId>;
export const ConversationItemId = typeIdValidator("conversationItem");
export type ConversationItemId = z.infer<typeof ConversationItemId>;

export const TaskId = typeIdValidator("task");
export type TaskId = z.infer<typeof TaskId>;
export const TimeEntryId = typeIdValidator("timeEntry");
export type TimeEntryId = z.infer<typeof TimeEntryId>;

export const ProductCategoryId = typeIdValidator("productCategory");
export type ProductCategoryId = z.infer<typeof ProductCategoryId>;
export const ProductTagId = typeIdValidator("productTag");
export type ProductTagId = z.infer<typeof ProductTagId>;

export const SubscriptionPlanProductId = typeIdValidator("subscriptionPlanProduct");  
export type SubscriptionPlanProductId = z.infer<typeof SubscriptionPlanProductId>;

export const InventoryLogId = typeIdValidator("inventoryLog");
export type InventoryLogId = z.infer<typeof InventoryLogId>;  

export const SubscriptionId = typeIdValidator("subscription");
export type SubscriptionId = z.infer<typeof SubscriptionId>;

export const ProductMediaId = typeIdValidator("productMedia");
export type ProductMediaId = z.infer<typeof ProductMediaId>;  

export const StoreId = typeIdValidator("store");
export type StoreId = z.infer<typeof StoreId>;
export const StoreItemId = typeIdValidator("storeItem");
export type StoreItemId = z.infer<typeof StoreItemId>;

export const StoreScheduleId = typeIdValidator("storeSchedule");
export type StoreScheduleId = z.infer<typeof StoreScheduleId>;

export const PaymentId = typeIdValidator("payment");
export type PaymentId = z.infer<typeof PaymentId>;  

export const FulfillmentId = typeIdValidator("fulfillment");
export type FulfillmentId = z.infer<typeof FulfillmentId>;

export const TaxRateId = typeIdValidator("taxRate");
export type TaxRateId = z.infer<typeof TaxRateId>;

export const ShippingMethodId = typeIdValidator("shippingMethod");
export type ShippingMethodId = z.infer<typeof ShippingMethodId>;

export const TagId = typeIdValidator("tag");
export type TagId = z.infer<typeof TagId>;

export const OrderId = typeIdValidator("order");
export type OrderId = z.infer<typeof OrderId>;

export const NoteId = typeIdValidator("note");
export type NoteId = z.infer<typeof NoteId>;

export const NoteOrderId = typeIdValidator("noteOrder");
export type NoteOrderId = z.infer<typeof NoteOrderId>;

export const DiscountCodeId = typeIdValidator("discountCode");
export type DiscountCodeId = z.infer<typeof DiscountCodeId>;

export const InventoryMovementId = typeIdValidator("inventoryMovement");
export type InventoryMovementId = z.infer<typeof InventoryMovementId>;

export const SessionId = typeIdValidator("session");
export type SessionId = z.infer<typeof SessionId>;

export const AccountId = typeIdValidator("account");
export type AccountId = z.infer<typeof AccountId>;

export const VerificationId = typeIdValidator("verification");
export type VerificationId = z.infer<typeof VerificationId>;

export const PasskeyId = typeIdValidator("passkey");
export type PasskeyId = z.infer<typeof PasskeyId>;

export const InvitationId = typeIdValidator("invitation");
export type InvitationId = z.infer<typeof InvitationId>;

export const ApiKeyId = typeIdValidator("apikey");
export type ApiKeyId = z.infer<typeof ApiKeyId>;

export const PaymentMethodId = typeIdValidator("paymentMethod");
export type PaymentMethodId = z.infer<typeof PaymentMethodId>;

export const CartId = typeIdValidator("cart");
export type CartId = z.infer<typeof CartId>;

export const CartItemId = typeIdValidator("cartItem");
export type CartItemId = z.infer<typeof CartItemId>;

export const OrderItemId = typeIdValidator("orderItem");
export type OrderItemId = z.infer<typeof OrderItemId>;

export const InventoryLocationId = typeIdValidator("inventoryLocation");
export type InventoryLocationId = z.infer<typeof InventoryLocationId>;

export const DigitalProductId = typeIdValidator("digitalProduct");
export type DigitalProductId = z.infer<typeof DigitalProductId>;

export const FormId = typeIdValidator("form");
export type FormId = z.infer<typeof FormId>;

export const FormTemplateId = typeIdValidator("formTemplate");
export type FormTemplateId = z.infer<typeof FormTemplateId>;

export const FormFieldId = typeIdValidator("formField");
export type FormFieldId = z.infer<typeof FormFieldId>;

export const FormSubmissionId = typeIdValidator("formSubmission");
export type FormSubmissionId = z.infer<typeof FormSubmissionId>;

// --- CMS Specific IDs ---
export const CmsContentId = typeIdValidator("cmsContent");
export type CmsContentId = z.infer<typeof CmsContentId>;

export const ContentTypeId = typeIdValidator("contentType");
export type ContentTypeId = z.infer<typeof ContentTypeId>;

export const EntityLinkId = typeIdValidator("entityLink");
export type EntityLinkId = z.infer<typeof EntityLinkId>;

export const LanguageId = typeIdValidator("language");
export type LanguageId = z.infer<typeof LanguageId>;

export const PaymentIntentId = typeIdValidator("paymentIntent");
export type PaymentIntentId = z.infer<typeof PaymentIntentId>;
