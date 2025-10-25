package com.doran.user.utils.validators

import com.doran.user.domain.controllers.InterestsInput
import com.doran.user.utils.annotations.ValidateInterestsCount
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext

class InterestsCountValidator: ConstraintValidator<ValidateInterestsCount, InterestsInput> {
    override fun isValid(value: InterestsInput?, context: ConstraintValidatorContext?): Boolean {
        println(value)
        if (value == null) {
            return false
        }

        val nonNullCount = listOf(value.interest1, value.interest2, value.interest3)
            .count { it.isBlank().not() }
        return nonNullCount in 1..3
    }

}