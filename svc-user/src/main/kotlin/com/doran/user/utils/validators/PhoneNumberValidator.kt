package com.doran.user.utils.validators

import com.doran.user.utils.annotations.ValidatePhoneNumber
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext

class PhoneNumberValidator: ConstraintValidator<ValidatePhoneNumber, String> {
    private val PHONE_REGEX = Regex("^01\\d{1}-\\d{4}-\\d{4}$")
    override fun isValid(phoneNumber: String?, context: ConstraintValidatorContext?): Boolean {
        if (phoneNumber.isNullOrBlank()) {
            return false
        }
        return phoneNumber.matches(PHONE_REGEX)
    }
}