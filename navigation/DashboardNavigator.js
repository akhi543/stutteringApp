import { createDrawerNavigator } from 'react-navigation-drawer';

import DashboardStackNavigator from './DashboardStackNavigator';

const DashboardNavigator = createDrawerNavigator(
    {
        Home: {
            screen: DashboardStackNavigator,
        }
    }
);

export default DashboardNavigator;