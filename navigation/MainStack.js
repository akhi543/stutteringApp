import { createStackNavigator } from 'react-navigation-stack';

import Login from '../screens/Login';
import Access from '../screens/Access';
import Home from '../screens/Home';

const MainStack = createStackNavigator(
    {
        Login: {
            screen: Login,
            navigationOptions: {
                title: 'Login',
                headerShown: false
            }
        },
        Access: {
            screen: Access,
            navigationOptions: {
                title: 'Access Code',
                headerLeft: () => null
            }
        },
        Home: {
            screen: Home,
            navigationOptions: {
                title: 'Stuttering App',
                headerLeft: () => null
            }
        }
    },
    {
        headerMode: 'screen',
        initialRouteName: 'Login'
    }
);

const prevGetStateForAction = MainStack.router.getStateForAction;
MainStack.router = {
    ...MainStack.router,
    getStateForAction(action, state) {
        if (state && action.type === 'ReplaceCurrentScreen') {
            const routes = state.routes.slice(0, state.routes.length - 1);
            routes.push(action);
            return {
                ...state,
                routes,
                index: routes.length - 1,
            };
        }
        return prevGetStateForAction(action, state);
    }
}

export default MainStack;