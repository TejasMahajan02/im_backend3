import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from './entities/otp.entity';

@Injectable()
export class OtpService {
    constructor(
        @InjectRepository(Otp)
        private readonly otpRepository: Repository<Otp>,
    ) { }

    generateNumericOTP(length = 6): string {
        // Ensure the length is reasonable
        if (length < 1) {
            throw new Error('OTP length must be at least 1');
        }

        // Generate the first digit separately to ensure it is not zero
        const firstDigit = Math.floor(Math.random() * 9) + 1; // This ensures the first digit is between 1 and 9

        // Generate the remaining digits
        const maxNumber = Math.pow(10, length - 1);
        const randomNumber = Math.floor(Math.random() * maxNumber);

        // Concatenate the first digit with the remaining digits, padding with leading zeros if necessary
        const remainingDigits = randomNumber.toString().padStart(length - 1, '0');

        // Combine the first digit with the remaining digits
        return firstDigit.toString() + remainingDigits;
    }

    isExpired(timestamp: Date): boolean {
        // Get the current time
        const currentTime = new Date();

        // Calculate expiration time (5 minutes later)
        const expirationTime = timestamp.getTime() + 5 * 60 * 1000;

        // Check if the current time is past the expiration time
        return currentTime.getTime() > expirationTime;
    }
    
    create(otp: string, createdAt: Date): Otp {
        const otpEntity = new Otp();
        otpEntity.otp = otp;
        otpEntity.createdAt = createdAt;
        return otpEntity;
    }

    async save(otpEntity: object): Promise<Otp> {
        return await this.otpRepository.save(otpEntity);
    }
}
