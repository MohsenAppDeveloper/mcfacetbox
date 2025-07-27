import { DataBoxType, SupervisionStatus } from '@/types/baseModels'

export const resolveActiveColor = (isActive: boolean) => {
  if (isActive)
    return 'success'
  else
    return 'error'
}

export const resolveActiveTitle = (isActive: boolean) => {
  if (isActive)
    return 'active'
  else
    return 'deactive'
}

/**
 * این تابع برای مشخص کردن این است که کدام یک از دکمه های نظارت میتواند فعال باشد
 * @param statusid  وضعیت فعلی نظارت
 * @param resolvertargetid وظیفه دکمه : مثلا اگر با دکمه تایید کار داشته باشیم وضعیت accept ارسال میشود
 * @returns
 */
export const resolveSupervisionStatus = (statusid: SupervisionStatus, resolvertargetid: SupervisionStatus) => {
  switch (resolvertargetid) {
    case SupervisionStatus.primary:
      if (statusid === SupervisionStatus.ready || statusid === SupervisionStatus.review)
        return true
    break;
    case SupervisionStatus.ready:
      if (statusid === SupervisionStatus.primary || statusid === SupervisionStatus.review)
        return true
    break;

    // کاربر میتواند با تغییر فیش ان را در حالت خواندنی درآوردو یا ناظر فیش، نیاز به بازبینی را تایید کند
    case SupervisionStatus.accept:
      if (statusid === SupervisionStatus.ready || statusid === SupervisionStatus.review)
        return true
    break
    case SupervisionStatus.correct:
      return false
      break;

    // کازیز میتواند فیش را از حالت نظارت خارج کند، ناظر میتواند فیش اماده برای نظارت را نیاز به بازبینی کند و یا فیش تایید شده را نیاز به بازبینی کند
    case SupervisionStatus.review:
      if (statusid === SupervisionStatus.ready || statusid === SupervisionStatus.accept)
        return true
    default:
      return false
  }
}

export const createHadithURL = (resourceid: string) => {
  return `https://hadith.inoor.ir/fa/hadith/${resourceid}`
}
export const createAyahUrl = (surahid: string, ayahid: string) => {
  return `https://quran.inoor.ir/fa/ayah/${surahid}/${ayahid}`
}
