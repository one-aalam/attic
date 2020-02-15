import EventEmitter from 'eventemitter3';

const EE = new EventEmitter();

export const EVENTS =  {
    user: {
      signUp: 'onUserSignUp',
      signIn: 'onUserSignIn',
      resetPassword: 'onUserResetPassword'
    },
};

export default EE;