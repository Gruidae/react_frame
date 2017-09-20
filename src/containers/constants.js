export const APP_NAME = '海绵拍';
export const SELECT_ORDER_UNIT_YEAR = '1';
export const SELECT_ORDER_UNIT_MONTH = '2';
export const SELECT_ORDER_UNIT_DAY = '3';

export const LEVEL_UNIMPORTANT_URGENT = '1';
export const LEVEL_IMPORTANT_NON_URGENT = '2';
export const LEVEL_IMPORTANT_URGENT = '3';

export const IS_SAVE_TO_DRAFTBOX = 0;
export const IS_PUBLISH = 1;

export const START_BID_SUCCESS = 0;
export const START_BID_PERMISSION_DENIED = -3001;
export const START_BID_PERMISSION_REVIEW = -3002;

export const PRODUCT_ANNOUNCED = 0;
export const PRODUCT_PUBLISHED = 1;
export const PRODUCT_RECEIVED = 2;
export const PRODUCT_CANCEL = 3;
export const PRODUCT_END = 4;

export const CASE_DRAFTBOX = 0;
export const CASE_WAIT_PROCESS = 10;
export const CASE_PROCESSING = 20;
export const CASE_COMPLETE = 30;
export const CASE_CANCEL = 40;

export const BID_PUBLISHED = 0;
export const BID_CANCEL = 1;
export const PRODUCT_REJECTED = 2;
export const BID_END = 3;

export const LEVEL_MAP = {
  LEVEL_UNIMPORTANT_URGENT: '紧急不重要',
  LEVEL_IMPORTANT_NON_URGENT: '重要不紧急',
  LEVEL_IMPORTANT_URGENT: '重要紧急',
};

export const DATE_MAP = {
  SELECT_ORDER_UNIT_YEAR: '年',
  SELECT_ORDER_UNIT_MONTH: '月',
  SELECT_ORDER_UNIT_DAY: '日',
};

export const PRODUCT_STEP_MAP = {
  0: PRODUCT_ANNOUNCED,
  10: PRODUCT_PUBLISHED,
  20: PRODUCT_RECEIVED,
  30: PRODUCT_CANCEL,
  40: PRODUCT_END,
};

export const BID_STEP_MAP = {
  0: BID_PUBLISHED,
  10: BID_CANCEL,
  20: PRODUCT_REJECTED,
  30: BID_END,
};

export const LEVEL_MAP_DETAIL = {
  1: '紧急不重要',
  2: '重要不紧急',
  3: '重要紧急',
};

export const DATE_MAP_DETAIL = {
  1: '年',
  2: '月',
  3: '日',
};

export const PAGE_TITLE_HOME_PAGE = '首页';
export const PAGE_TITLE_HELP_PAGE = '帮助';

export const PAGE_TITLE_CREATE_CASE = '提交案例';
export const PAGE_TITLE_DRAFT_CASES = '案例草稿箱';
export const PAGE_TITLE_CASE_LIST = '案例列表';

export const PAGE_TITLE_ACCEPTED_CASES = '我受理的案例';
export const PAGE_TITLE_PUBLISHED_PRODUCTS = '我发布的产品';
export const PAGE_TITLE_DRAFT_PRODUCTS = '制作中的产品';
export const PAGE_TITLE_APPLY_BID_LIST = '投标权限审核';

export const PAGE_TITLE_ACCEPTED_CASES_SHORT = '已受理';
export const PAGE_TITLE_PUBLISHED_PRODUCTS_SHORT = '已发布';
export const PAGE_TITLE_DRAFT_PRODUCTS_SHORT = '制作中';
export const PAGE_TITLE_APPLY_BID_LIST_SHORT = '权限审核';

export const PAGE_TITLE_CREATE_PRODUCT = '提交产品';
export const PAGE_TITLE_PRODUCT_LIST = '产品大厅';
export const PAGE_TITLE_PUBLISHED_CASES = '我发布的案例';
export const PAGE_TITLE_BIDDEN_PRODUCTS = '我投标的产品';
export const PAGE_TITLE_MY_SETTING = '个人设置';
export const PAGE_TITLE_INBOX = '站内信';

export const PAGE_TITLE_PM = '海绵亲亲';

export const PAGE_TITLE_LOGIN = '登录';
export const PAGE_TITLE_REGISTER = '注册';
export const PAGE_TITLE_LOGOUT = '登出';

