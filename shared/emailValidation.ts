import disposableDomains from 'disposable-email-domains';
import { promisify } from 'util';
import { resolve } from 'dns';

const resolveMx = promisify(resolve);

// Whitelist of guaranteed safe domains that bypass disposable checks
const SAFE_DOMAINS = new Set([
  'gmail.com',
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
  'icloud.com',
  'protonmail.com',
  'proton.me',
  'aol.com',
  'live.com',
  'msn.com',
  'comcast.net',
  'verizon.net',
  'att.net',
  'sbcglobal.net',
  'cox.net',
  'charter.net',
  'earthlink.net',
  // Educational domains
  'edu',
  'ac.uk',
  'edu.au',
  'edu.in',
  'edu.sg',
  // Corporate domains
  'company.com',
  'corp.com',
  'work.com'
]);

// Additional known disposable domains to supplement the npm package
const ADDITIONAL_DISPOSABLE_DOMAINS = new Set([
  // Common temporary email services
  '10minutemail.com',
  '10minutemail.net',
  '20minutemail.com',
  '30minutemail.com',
  'tempmail.com',
  'temp-mail.org',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamail.biz',
  'guerrillamail.de',
  'sharklasers.com',
  'grr.la',
  'guerrillamailblock.com',
  'pokemail.net',
  'spam4.me',
  'mailinator.com',
  'mailinator.net',
  'mailinator2.com',
  'mailinator.gq',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'cool.fr.nf',
  'jetable.fr.nf',
  'nospam.ze.tc',
  'nomail.xl.cx',
  'mega.zik.dj',
  'speed.1s.fr',
  'courriel.fr.nf',
  'moncourrier.fr.nf',
  'monemail.fr.nf',
  'monmail.fr.nf',
  'maildrop.cc',
  'maildrop.cf',
  'maildrop.ga',
  'maildrop.gq',
  'maildrop.ml',
  'maildrop.tk',
  'throwaway.email',
  'zetmail.com',
  'trashmail.com',
  'trashmail.org',
  'trashmail.net',
  'trashmail.ws',
  'trashmail.de',
  'spamgourmet.com',
  'spamgourmet.net',
  'spamgourmet.org',
  'spamhole.com',
  'spamex.com',
  'spamfree24.org',
  'spamfree24.de',
  'spamfree24.eu',
  'spamfree24.net',
  'spamfree24.com',
  'emailondeck.com',
  'emailondeck.de',
  'emailondeck.net',
  'emailondeck.org',
  'emailondeck.com',
  'fakeinbox.com',
  'fakemail.net',
  'fakemailgenerator.com',
  'getnada.com',
  'harakirimail.com',
  'incognitomail.org',
  'incognitomail.com',
  'incognitomail.net',
  'mytrashmail.com',
  'no-spam.ws',
  'nwldx.com',
  'objectmail.com',
  'proxymail.eu',
  'rcpt.at',
  'safe-mail.net',
  'selfdestructingmail.com',
  'sneakemail.com',
  'sogetthis.com',
  'soodonims.com',
  'spambog.com',
  'spambog.de',
  'spambog.ru',
  'spambox.us',
  'spamcannon.com',
  'spamcannon.net',
  'spamday.com',
  'spamherelots.com',
  'spamhereplease.com',
  'spamthisplease.com',
  'speed.1s.fr',
  'superrito.com',
  'tempemail.com',
  'tempemail.net',
  'tempinbox.com',
  'tempmail.it',
  'tempmail2.com',
  'tempmailer.com',
  'tempmailer.de',
  'tempmailaddress.com',
  'tempr.email',
  'trbvm.com',
  'wegwerfmail.de',
  'wegwerfmail.net',
  'wegwerfmail.org',
  'wh4f.org',
  'whyspam.me',
  'willselfdestruct.com',
  'xemaps.com',
  'xents.com',
  'xmaily.com',
  'xoxy.net',
  'yuurok.com',
  'zehnminutenmail.de',
  'zetmail.com',
  'zoemail.org',
  // Newer services
  'mohmal.com',
  'mailnesia.com',
  'mailcatch.com',
  'maildu.de',
  'mailforspam.com',
  'mailfreeonline.com',
  'mailguard.me',
  'mailhz.me',
  'mailimate.com',
  'mailin8r.com',
  'mailinblack.com',
  'mailismagic.com',
  'mailmetrash.com',
  'mailmoat.com',
  'mailnull.com',
  'mailpick.biz',
  'mailrock.biz',
  'mailscrap.com',
  'mailshell.com',
  'mailsiphon.com',
  'mailtemp.info',
  'mailtothis.com',
  'mailzilla.com',
  'mailzilla.org',
  'makemetheking.com',
  'manybrain.com',
  'mbx.cc',
  'mega.zik.dj',
  'meltmail.com',
  'messagebeamer.de',
  'mierdamail.com',
  'mintemail.com',
  'mjukglass.nu',
  'mobi.web.id',
  'moburl.com',
  'moncourrier.fr.nf',
  'monemail.fr.nf',
  'monmail.fr.nf',
  'monumentmail.com',
  'mt2009.com',
  'mt2014.com',
  'mypartyclip.de',
  'myphantomemail.com',
  'mysamp.de',
  'myspaceinc.com',
  'myspaceinc.net',
  'myspaceinc.org',
  'myspacepimpedup.com',
  'myspamless.com',
  'mytrashmail.com',
  'neomailbox.com',
  'nepwk.com',
  'nervmich.net',
  'nervtmich.net',
  'netmails.com',
  'netmails.net',
  'netzidiot.de',
  'neverbox.com',
  'nice-4u.com',
  'nincsmail.hu',
  'nnh.com',
  'no-spam.ws',
  'nobulk.com',
  'noclickemail.com',
  'nogmailspam.info',
  'nomail.xl.cx',
  'nomail2me.com',
  'nomorespamemails.com',
  'nonspam.eu',
  'nonspammer.de',
  'noref.in',
  'nospam.ze.tc',
  'nospam4.us',
  'nospamfor.us',
  'nospammail.net',
  'nospamthanks.info',
  'notmailinator.com',
  'notsharingmy.info',
  'nowhere.org',
  'nowmymail.com',
  'nurfuerspam.de',
  'nwldx.com',
  'objectmail.com',
  'obobbo.com',
  'odaymail.com',
  'oneoffemail.com',
  'onewaymail.com',
  'onlatedotcom.info',
  'online.ms',
  'oopi.org',
  'opayq.com',
  'ordinaryamerican.net',
  'otherinbox.com',
  'ovpn.to',
  'owlpic.com',
  'pancakemail.com',
  'paplease.com',
  'pcusers.otherinbox.com',
  'pjkpjk.com',
  'plexolan.de',
  'poczta.onet.pl',
  'politikerclub.de',
  'poofy.org',
  'pookmail.com',
  'privacy.net',
  'privatdemail.net',
  'proxymail.eu',
  'prtnx.com',
  'putthisinyourspamdatabase.com',
  'pwrby.com',
  'quickinbox.com',
  'rcpt.at',
  'reallymymail.com',
  'realtyalerts.ca',
  'recode.me',
  'recursor.net',
  'regbypass.com',
  'regbypass.comsafe-mail.net',
  'rejectmail.com',
  'rhyta.com',
  'rklips.com',
  'rmqkr.net',
  'royal.net',
  'rppkn.com',
  'rtrtr.com',
  'ruffemail.com',
  's0ny.net',
  'safe-mail.net',
  'safersignup.de',
  'safetymail.info',
  'safetypost.de',
  'sandelf.de',
  'saynotospams.com',
  'schafmail.de',
  'schrott-email.de',
  'secretemail.de',
  'secure-mail.biz',
  'selfdestructingmail.com',
  'selfdestructingmail.org',
  'sendspamhere.de',
  'sharklasers.com',
  'shieldedmail.com',
  'shiftmail.com',
  'shitmail.me',
  'shitware.nl',
  'shmeriously.com',
  'shortmail.net',
  'sibmail.com',
  'sinnlos-mail.de',
  'siteposter.net',
  'skeefmail.com',
  'slaskpost.se',
  'slopsbox.com',
  'slushmail.com',
  'smashmail.de',
  'smellfear.com',
  'snakemail.com',
  'sneakemail.com',
  'sneakmail.de',
  'snkmail.com',
  'sofimail.com',
  'sofort-mail.de',
  'sogetthis.com',
  'soodonims.com',
  'spam.la',
  'spam.su',
  'spam4.me',
  'spamail.de',
  'spambob.com',
  'spambob.net',
  'spambob.org',
  'spambog.com',
  'spambog.de',
  'spambog.ru',
  'spambox.info',
  'spambox.irishspringtours.com',
  'spambox.us',
  'spamcannon.com',
  'spamcannon.net',
  'spamcero.com',
  'spamcon.org',
  'spamcorptastic.com',
  'spamcowboy.com',
  'spamcowboy.net',
  'spamcowboy.org',
  'spamday.com',
  'spamex.com',
  'spamfree24.com',
  'spamfree24.de',
  'spamfree24.eu',
  'spamfree24.net',
  'spamfree24.org',
  'spamgoes.com',
  'spamgourmet.com',
  'spamgourmet.net',
  'spamgourmet.org',
  'spamherelots.com',
  'spamhereplease.com',
  'spamhole.com',
  'spami.spam.co.za',
  'spaml.com',
  'spaml.de',
  'spammotel.com',
  'spamobox.com',
  'spamoff.de',
  'spamslicer.com',
  'spamspot.com',
  'spamthis.co.uk',
  'spamthisplease.com',
  'spamtrail.com',
  'spamtroll.net',
  'speed.1s.fr',
  'spoofmail.de',
  'stuffmail.de',
  'super-auswahl.de',
  'supergreatmail.com',
  'supermailer.jp',
  'superrito.com',
  'superstachel.de',
  'suremail.info',
  'talkinator.com',
  'tapchicuoihoi.com',
  'teewars.org',
  'teleworm.com',
  'teleworm.us',
  'temp-mail.org',
  'temp-mail.ru',
  'tempalias.com',
  'tempe-mail.com',
  'tempemail.biz',
  'tempemail.com',
  'tempinbox.co.uk',
  'tempinbox.com',
  'tempmail.eu',
  'tempmail.it',
  'tempmail2.com',
  'tempmailer.com',
  'tempmailer.de',
  'tempmailaddress.com',
  'tempymail.com',
  'thanksnospam.info',
  'thankyou2010.com',
  'thc.st',
  'thelimestones.com',
  'thisisnotmyrealemail.com',
  'thismail.net',
  'throwawayemailaddresses.com',
  'tilien.com',
  'tittbit.in',
  'tmail.ws',
  'tmailinator.com',
  'toiea.com',
  'toomail.biz',
  'topranklist.de',
  'tradermail.info',
  'trash-amil.com',
  'trash-mail.at',
  'trash-mail.com',
  'trash-mail.de',
  'trash2009.com',
  'trashdevil.com',
  'trashdevil.de',
  'trashemail.de',
  'trashmail.at',
  'trashmail.com',
  'trashmail.de',
  'trashmail.me',
  'trashmail.net',
  'trashmail.org',
  'trashmail.ws',
  'trashmailer.com',
  'trashymail.com',
  'trashymail.net',
  'trbvm.com',
  'trialmail.de',
  'trillianpro.com',
  'turual.com',
  'twinmail.de',
  'tyldd.com',
  'uggsrock.com',
  'umail.net',
  'upliftnow.com',
  'uplipht.com',
  'uroid.com',
  'us.af',
  'venompen.com',
  'veryrealemail.com',
  'viditag.com',
  'viewcastmedia.com',
  'viewcastmedia.net',
  'viewcastmedia.org',
  'vomoto.com',
  'vubby.com',
  'walala.org',
  'walkmail.net',
  'webemail.me',
  'weg-werf-email.de',
  'wegwerf-emails.de',
  'wegwerfadresse.de',
  'wegwerfemail.com',
  'wegwerfemail.de',
  'wegwerfmail.de',
  'wegwerfmail.net',
  'wegwerfmail.org',
  'wetrainbayarea.com',
  'wetrainbayarea.org',
  'wh4f.org',
  'whatiaas.com',
  'whatpaas.com',
  'whopy.com',
  'whyspam.me',
  'willhackforfood.biz',
  'willselfdestruct.com',
  'winemaven.info',
  'wronghead.com',
  'wuzup.net',
  'wuzupmail.net',
  'www.e4ward.com',
  'www.gishpuppy.com',
  'www.mailinator.com',
  'wwwnew.eu',
  'x.ip6.li',
  'xagloo.com',
  'xemaps.com',
  'xents.com',
  'xmaily.com',
  'xoxy.net',
  'yapped.net',
  'yeah.net',
  'yep.it',
  'yogamaven.com',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'youmailr.com',
  'yourdomain.com',
  'ypmail.webredirect.org',
  'yuurok.com',
  'zehnminutenmail.de',
  'zetmail.com',
  'zippymail.info',
  'zoemail.net',
  'zoemail.org',
  'zomg.info'
]);

// Combine npm package domains with additional ones
const ALL_DISPOSABLE_DOMAINS = new Set([
  ...disposableDomains,
  ...ADDITIONAL_DISPOSABLE_DOMAINS
]);

/**
 * Extract domain from email address
 */
export function extractDomain(email: string): string {
  const atIndex = email.lastIndexOf('@');
  if (atIndex === -1) throw new Error('Invalid email format');
  return email.slice(atIndex + 1).toLowerCase().trim();
}

/**
 * Basic email format validation
 */
export function isValidEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Check if domain is in the safe whitelist
 */
export function isSafeDomain(domain: string): boolean {
  return SAFE_DOMAINS.has(domain.toLowerCase());
}

/**
 * Check if domain is disposable/temporary
 */
export function isDisposableDomain(domain: string): boolean {
  const normalizedDomain = domain.toLowerCase();
  
  // Check exact match first
  if (ALL_DISPOSABLE_DOMAINS.has(normalizedDomain)) {
    return true;
  }
  
  // Check for subdomain matches (e.g., mail.tempmail.com should match tempmail.com)
  for (const disposableDomain of Array.from(ALL_DISPOSABLE_DOMAINS)) {
    if (normalizedDomain.endsWith('.' + disposableDomain)) {
      return true;
    }
  }
  
  // Additional pattern-based checks for common disposable email patterns
  const suspiciousPatterns = [
    /^temp/,           // temp*, temporary*
    /^throw/,          // throwaway*
    /^trash/,          // trash*
    /^spam/,           // spam*
    /^fake/,           // fake*
    /^guerr/,          // guerrilla*
    /^mail.*temp/,     // mail*temp*
    /^temp.*mail/,     // temp*mail*
    /^\d+min/,         // 10min*, 20min*
    /minute.*mail/,    // *minute*mail*
    /disposable/,      // *disposable*
    /temporary/,       // *temporary*
    /throwaway/,       // *throwaway*
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(normalizedDomain)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Perform MX record DNS lookup to verify domain can receive emails
 * Returns true if domain has valid MX records
 */
export async function hasMxRecord(domain: string): Promise<boolean> {
  try {
    const records = await resolveMx(domain);
    return Array.isArray(records) && records.length > 0;
  } catch (error) {
    // DNS lookup failed - domain likely doesn't exist or can't receive emails
    console.warn(`MX lookup failed for domain ${domain}:`, error);
    return false;
  }
}

/**
 * Comprehensive email validation result
 */
export interface EmailValidationResult {
  isValid: boolean;
  domain: string;
  issues: string[];
  isSafe: boolean;
  isDisposable: boolean;
  hasMx: boolean;
}

/**
 * Validate email comprehensively (format, disposable check, MX record)
 * This is the main validation function to use
 */
export async function validateEmail(email: string): Promise<EmailValidationResult> {
  const result: EmailValidationResult = {
    isValid: false,
    domain: '',
    issues: [],
    isSafe: false,
    isDisposable: false,
    hasMx: false
  };

  // Step 1: Basic format validation
  if (!isValidEmailFormat(email)) {
    result.issues.push('Invalid email format');
    return result;
  }

  try {
    // Step 2: Extract domain
    result.domain = extractDomain(email);
  } catch (error) {
    result.issues.push('Could not extract domain from email');
    return result;
  }

  // Step 3: Check if domain is in safe whitelist
  result.isSafe = isSafeDomain(result.domain);
  
  // Step 4: Check if domain is disposable (skip if whitelisted)
  if (!result.isSafe) {
    result.isDisposable = isDisposableDomain(result.domain);
    if (result.isDisposable) {
      result.issues.push('Temporary emails are not allowed');
    }
  }

  // Step 5: MX record validation (skip if already failed disposable check)
  if (!result.isDisposable || result.isSafe) {
    try {
      result.hasMx = await hasMxRecord(result.domain);
      if (!result.hasMx) {
        result.issues.push('Temporary emails are not allowed');
      }
    } catch (error) {
      result.issues.push('Unable to verify email domain');
    }
  }

  // Overall validation result
  result.isValid = result.issues.length === 0 && (result.isSafe || (!result.isDisposable && result.hasMx));

  return result;
}

/**
 * Quick frontend-only validation (no MX check)
 * Use this for real-time validation in forms
 */
export function validateEmailQuick(email: string): Omit<EmailValidationResult, 'hasMx'> {
  const result: Omit<EmailValidationResult, 'hasMx'> = {
    isValid: false,
    domain: '',
    issues: [] as string[],
    isSafe: false,
    isDisposable: false
  };

  // Step 1: Basic format validation
  if (!isValidEmailFormat(email)) {
    result.issues.push('Invalid email format');
    return result;
  }

  try {
    // Step 2: Extract domain
    result.domain = extractDomain(email);
  } catch (error) {
    result.issues.push('Could not extract domain from email');
    return result;
  }

  // Step 3: Check if domain is in safe whitelist
  result.isSafe = isSafeDomain(result.domain);
  
  // Step 4: Check if domain is disposable (skip if whitelisted)
  if (!result.isSafe) {
    result.isDisposable = isDisposableDomain(result.domain);
    if (result.isDisposable) {
      result.issues.push('Disposable/temporary email addresses are not allowed');
    }
  }

  // Overall validation result (without MX check)
  result.isValid = result.issues.length === 0;

  return result;
}