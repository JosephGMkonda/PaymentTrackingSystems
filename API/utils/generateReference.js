export function generateRandomReference(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let ref = '';
    for (let i = 0; i < length; i++) {
      ref += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `REF-${ref}`;
}