package com.doran.user.utils.validators

import com.doran.user.utils.annotations.ValidatePassword
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext

class PasswordValidator: ConstraintValidator<ValidatePassword, String> {
    private val PASSWORD_REGEX = Regex("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=]).{8,15}$")
    override fun isValid(password: String?, context: ConstraintValidatorContext?): Boolean {
        if (password.isNullOrBlank()) {
            return false
        }
        return password.matches(PASSWORD_REGEX)
    }
}