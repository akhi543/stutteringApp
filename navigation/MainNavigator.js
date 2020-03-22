import { createSwitchNavigator } from 'react-navigation';

import Login from '../screens/Login';
import Access from '../screens/Access';
import DashboardNavigator from './DashboardNavigator'

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