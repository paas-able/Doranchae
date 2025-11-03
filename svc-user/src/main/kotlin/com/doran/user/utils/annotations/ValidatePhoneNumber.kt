package com.doran.user.utils.annotations

import com.doran.user.utils.validators.PhoneNumberValidator
import jakarta.validation.Constraint
import jakarta.validation.Payload
import kotlin.reflect.KClass

@Constraint(validatedBy = [PhoneNumberValidator::class])
@Target(AnnotationTarget.FIELD, AnnotationTarget.PROPERTY_GETTER)
@Retention(AnnotationRetention.RUNTIME)
annotation class ValidatePhoneNumber(
    val message: String = "01x-xxxx-xxxx 형식을 만족해야합니다.",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = []
)
