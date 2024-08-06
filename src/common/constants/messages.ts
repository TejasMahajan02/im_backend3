export const UserMessages = {
    isExist: 'User already exist.',
    notFound: 'User not found.',
    unexpectedError: 'Error creating user.',
    ok: 'User has been created successfully. You have sent an temporary password to login.',
    invalidPassword : 'Invalid password.',
    passwordUpdated : 'Password has been updated successfully.',
    userDeleted : 'User has been deleted successfully.'
};

export const OtpMessages = {
    unexpectedError: 'Error sending verification key.',
    ok: 'Otp has been verified successfully.',
    okAndUpdatePassword :  'Otp has been verified please update your password.',
    invalidOtp : 'Invalid otp.',
    otpExpired : 'Otp has been expired.',
    otpSent : 'Otp has been sent to your registered email',
    unverifiedOtp : 'You must verified otp first.'
};

export const EmailSubjects = {
    oneTimePassword: 'Your One Time Password',
    verificationKey: 'Verification Key',
};

export const OneTimePasswordEmailBody = (password: string) => `Your one time password : ${password}`;
export const OTP_EXPIRY = 5;
export const VerificationEmailBody = (key: string) => `Verification key : ${key} which will expires in ${OTP_EXPIRY} minute${OTP_EXPIRY > 1 && 's'}.`;

// Cases
export const CaseMessages = {
    isExist: 'Case already exists.',
    notFound: 'Case not found.',
    created : 'Case has been created successfully'
};

// Treatment Plan
export const TreatmentPlanMessages = {
    isExist: 'Treatment plan already exists.',
    notFound: 'Treatment plan not found.',
    created : 'Treatment plan has been created successfully'
};

// Cases
export const OrgMessages = {
    success : 'Organization has been invited successfully.',
    userExist : 'Organization is already invited.',
    regNoExist : 'Organization registration number has been already registered with another organization.',
    notFound : 'No organization has been found.',
    orgInvite : 'Doctor has been invited successfully.'
};

export const DoctorMessages = {

    inviteSuccess : 'Doctor has been invited successfully.',
    inviteExist : 'Doctor is already invited to this organization.',
};

