// declare module을 통해 해당 모듈의 타입을 우리가 직접 지정
declare module "react-native-keyboard-aware-scrollview" {
  import * as React from "react";
  class KeyboardAwareScrollViewComponent extends React.Component<ViewProps> {}
  export class KeyboardAwareScrollView extends KeyboardAwareScrollViewComponent {}
  export { KeyboardAwareScrollView };
}
