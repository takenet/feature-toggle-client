import { FeatureToggleClientService } from './FeatureToggleClientService';
import { IToggleable } from './types/IToggleable';

/**
 * This is a class example that has all feautures functions to be used in controller and view.
 * All methods names must describe feature-flag key
 *
 * - Class features must ends with "Features" prefix
 * - Generic features (user and application) must ends with "Enabled" prefix
 * - User features must ends with "UserEnabled" prefix
 * - Application features must ends with "ApplicationEnabled" prefix
 */

export const DashboardActiveMessage = 'dashboard-active-message';
class ClassFeatures implements IToggleable {
  public dashboardActiveMessageEnabled: {};
  public dashboardActiveMessageUserEnabled: {};
  public dashboardActiveMessageApplicationEnabled: {};

  public async checkFeatures(): Promise<any> {
    /**
     * Dashboard active messages generic feature example
     */
    this.dashboardActiveMessageEnabled = await FeatureToggleClientService.getInstance().isFeatureEnabled(
      DashboardActiveMessage
    );

    /**
     * Dashboard active message user feature example
     */
    this.dashboardActiveMessageUserEnabled = await FeatureToggleClientService.getInstance().isUserFeatureEnabled(
      DashboardActiveMessage
    );

    /**
     * Dashboard active message application feature example
     */
    this.dashboardActiveMessageApplicationEnabled = await FeatureToggleClientService.getInstance().isApplicationFeatureEnabled(
      DashboardActiveMessage
    );
  }
}
