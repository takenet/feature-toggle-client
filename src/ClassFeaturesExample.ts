import { FeatureToggleClientService } from './FeatureToggleClientService'

/**
 * This is a class example that has all feautures functions to be used in controller and view.
 * All methods names must describe feature-flag key
 *
 * - Class features must ends with "Features" prefix
 * - Generic features (user and application) must ends with "Enabled" prefix
 * - User features must ends with "UserEnabled" prefix
 * - Application features must ends with "ApplicationEnabled" prefix
 */

export const DashboardActiveMessage = 'dashboard-active-message'
class ClassFeatures {
  /**
   * Dashboard active messages generic feature example
   */
  public dashboardActiveMessageEnabled() {
    return FeatureToggleClientService.getInstance().isFeatureEnabled(
      DashboardActiveMessage
    )
  }

  /**
   * Dashboard active message user feature example
   */
  public dashboardActiveMessageUserEnabled(): Promise<{}> {
    return FeatureToggleClientService.getInstance().isUserFeatureEnabled(
      DashboardActiveMessage
    )
  }

  /**
   * Dashboard active message application feature example
   */
  public dashboardActiveMessageApplicationEnabled(): Promise<{}> {
    return FeatureToggleClientService.getInstance().isApplicationFeatureEnabled(
      DashboardActiveMessage
    )
  }
}
