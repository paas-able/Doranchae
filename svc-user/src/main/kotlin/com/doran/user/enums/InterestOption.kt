package com.doran.user.enums

enum class InterestOption(val code: String) {
    DAILY("일상"),
    SPORT("스포츠"),
    ECONOMIC("경제"),
    HEALTH("건강"),
    GARDENING("원예"),
    ISSUE("시사 ⋅ 이슈"),
    ART("예술"),
    WINE("와인"),
    ENTERTAINMENT("연예"),
    COFFEE("커피"),
    IMPROVEMENT("자기계발"),
    BOOK("독서"),
    PET("반려동물"),
    COOK("요리"),
    PSYCHOLOGY("심리"),
    HISTORY("역사");

    companion object {
        private val MAP: Map<String, InterestOption> = InterestOption.entries.associateBy { it.code }
        fun fromCode(code: String): InterestOption? {
            return MAP[code.uppercase()]
        }
    }
}