import { ObjectId } from 'mongodb'

export interface User {
    _id?: ObjectId
    email: string
    username: string
    password: string
    name: string
    photoUrl?: string
    phoneNumber?: string
    address?: {
        street: string
        city: string
        state: string
        country: string
        postalCode: string
    }
    dateOfBirth?: Date
    createdAt: Date
    updatedAt: Date
    lastLogin?: Date
    isVerified: boolean
    isActive: boolean
    role: 'USER' | 'ADMIN' | 'MODERATOR'

    // Financial Information
    balance: number
    totalWinnings: number
    totalBets: number
    totalDeposits: number
    totalWithdrawals: number
}

export interface Bet {
    _id?: ObjectId
    userId: ObjectId
    matchId: string
    amount: number
    odds: number
    status: 'PENDING' | 'WON' | 'LOST' | 'CANCELLED' | 'REFUNDED'
    potentialWin: number
    actualWin?: number
    placedAt: Date
    settledAt?: Date
    betType: 'MATCH_WINNER' | 'OVER_UNDER' | 'FIRST_SCORER' | 'CORRECT_SCORE' | 'HANDICAP'
    betDetails: {
        team?: string
        player?: string
        score?: string
        handicap?: number
        overUnder?: number
    }
}

export interface Transaction {
    _id?: ObjectId
    userId: ObjectId
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'BET_PLACED' | 'BET_WON' | 'BET_REFUND' | 'BONUS'
    amount: number
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
    paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'UPI' | 'WALLET' | 'CRYPTO'
    reference?: string
    description?: string
    createdAt: Date
    updatedAt: Date
}

export interface KYC {
    _id?: ObjectId
    userId: ObjectId
    documentType: 'PASSPORT' | 'DRIVERS_LICENSE' | 'NATIONAL_ID' | 'AADHAR_CARD'
    documentNumber: string
    documentUrl: string
    status: 'PENDING' | 'VERIFIED' | 'REJECTED'
    verifiedAt?: Date
    createdAt: Date
    updatedAt: Date
}

export interface Notification {
    _id?: ObjectId
    userId: ObjectId
    type: 'BET_RESULT' | 'TRANSACTION' | 'SYSTEM' | 'PROMOTION' | 'SECURITY'
    title: string
    message: string
    isRead: boolean
    createdAt: Date
}
