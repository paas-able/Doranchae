package com.doran.user.domain.valueObjects

import jakarta.persistence.*

@Embeddable
data class UserSetting(
    val termsAgree: Boolean,
    var notificationPush: Boolean, // push
    var notificationSMS: Boolean, // sms
    var notificationNOK: Boolean, // nok
) {
    fun updateNotificationSetting(
        notificationPush: Boolean = this.notificationPush,
        notificationSMS: Boolean = this.notificationSMS,
        notificationNOK: Boolean = this.notificationNOK
    ) : UserSetting {
        return this.copy(
            notificationPush = notificationPush,
            notificationSMS = notificationSMS,
            notificationNOK = notificationNOK
        )
    }
}
