interface DefaultProfile {
    profileRevision: number;
    profileId: string;
    profileChangesBaseRevision: number;
    profileChanges: [{
      changeType: string;
      profile: {
        _id: string;
        created: Date;
        updated: Date;
        rvn: number;
        wipeNumber: string;
        accountId: string;
        profileId: string;
        version: string;
        items: unknown;
        stats: {
          attributes: {
            personal_offers: Record<string, unknown>;
            import_friends_claimed: Record<string, unknown>;
            mtx_purchase_history: Record<string, unknown>;
            current_mtx_platform: string;
            mtx_affiliate: string;
            daily_purchases: Record<string, unknown>;
            in_app_purchases: Record<string, unknown>;
            permissions: Array<unknown>;
            undo_timeout: string;
            mfa_enabled: boolean;
            allowed_to_receive_gifts: boolean;
            gift_history: Record<string, unknown>;
            survey_data: Record<string, unknown>;
            intro_game_played: boolean;
            undo_cooldowns: Array<unknown>;
            inventory_limit_bonus: number;
            weekly_purchases: Record<string, unknown>;
            ban_history: Record<string, unknown>;
            monthly_purchases: Record<string, unknown>;
            allowed_to_send_gifts: Record<string, unknown>;
            mtx_affiliate_id: Record<string, unknown>;
          }
        }
        commandRevision: number;
      }
    }
  ];
  profileCommandRevision: number;
  serverTime: Date;
  responseVersion: number;
}

export default DefaultProfile;