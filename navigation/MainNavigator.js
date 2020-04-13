import { createSwitchNavigator } from 'react-navigation';

import Login from '../screens/Login';
import Access from '../screens/Access';
import DashboardNavigator from './DashboardNavigator'

/**
 * This is the main app navigator. It starts with the Login screen
 * and helps navigate the user through the initial screens of the app.
 */
const MainNavigator = createSwitchNavigator(
    {
        Login: {
            screen: Login
        },
        Access: {
            screen: Access
        },
        Dashboard: {
            screen: DashboardNavigator
        }
    }
);

export default MainNavigator;