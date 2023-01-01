import {
  LogInSuccessAction,
  LoginSuccessData,
  LogoutSuccessAction,
  LoginRequestAction,
} from "../actions/user";
import { Reducer } from "redux";

interface InitialState {
  isLoggingIn: boolean;
  loading: boolean;
  data: LoginSuccessData | null;
}
const initialState = {
  isLoggingIn: false,
  loading: false,
  data: null,
};

type UserReducerActions =
  | LogInSuccessAction
  | LogoutSuccessAction
  | LoginRequestAction;
const userReducer: Reducer<InitialState> = (
  prevState = initialState,
  action
) => {
  // 새로운 state 만들어주기
  switch (action.type) {
    case "LOG_IN_REQUEST":
      return {
        ...prevState,
        loading: true,
      };
    case "LOG_IN_SUCCESS":
      return {
        ...prevState,
        loading: false,
        data: action.data,
      };
    case "LOG_OUT":
      return {
        ...prevState,
        data: null,
      };
    default:
      return prevState;
  }
};

export default userReducer;
