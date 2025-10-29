package com.doran.user.enums

enum class Gender(val code: String) {
    FEMALE("여자"),
    MALE("남자");

    companion object {
        private val MAP: Map<String, Gender> = entries.associateBy { it.code }
        fun fromCode(code: String): Gender? {
            return MAP[code.uppercase()]
        }
    }
}