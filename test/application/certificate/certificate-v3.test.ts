import { BLOCKCHAINS, Certificate, CERTIFICATE_VERSIONS } from '../../../src';
import FIXTURES from '../../fixtures';
import signatureAssertion from '../../assertions/v3.0-alpha-learningmachine-signature-merkle2019.json';
import issuerProfileAssertion from '../../assertions/v3.0-alpha-issuer-profile.json';
import verificationStepsV3 from '../../assertions/verification-steps-v3.json';

const assertionTransactionId = '1e956a31736ad3bddf6302ba56050a3a36983610afeb9919256fd4d82e5dc175';

describe('Certificate entity test suite', function () {
  const fixture = FIXTURES.BlockcertsV3AlphaCustomContext;

  describe('constructor method', function () {
    describe('given it is called with valid v3 certificate data', function () {
      let certificate;

      beforeEach(async function () {
        certificate = new Certificate(fixture);
        await certificate.init();
      });

      afterEach(function () {
        certificate = null;
      });

      it('should set version to the certificate object', function () {
        expect(certificate.version).toBe(CERTIFICATE_VERSIONS.V3_0_alpha);
      });

      it('should set the decoded signature as the receipt to the certificate object', function () {
        expect(certificate.receipt).toEqual(signatureAssertion);
      });

      it('should set the transactionId to the certificate object', function () {
        expect(certificate.transactionId).toEqual(assertionTransactionId);
      });

      it('should set the chain property', function () {
        expect(certificate.chain).toEqual(BLOCKCHAINS.testnet);
      });

      it('should set the expires property', function () {
        // not currently set in the fixture
        expect(certificate.expires).toEqual((fixture as any).expirationDate);
      });

      it('should set the metadataJson property', function () {
        expect(certificate.metadataJson).toEqual(fixture.metadataJson);
      });

      it('should set the issuer property', function () {
        expect(certificate.issuer).toEqual(issuerProfileAssertion);
      });

      it('should set the issuedOn property', function () {
        expect(certificate.issuedOn).toEqual(fixture.issuanceDate);
      });

      it('should set the id property', function () {
        expect(certificate.id).toEqual(fixture.id);
      });

      it('should set the recordLink property', function () {
        expect(certificate.recordLink).toEqual(fixture.id);
      });

      it('should set the recipientFullName property', function () {
        expect(certificate.recipientFullName).toEqual(fixture.credentialSubject.name);
      });

      it('should set the rawTransactionLink property', function () {
        const rawTransactionLinkAssertion = `https://testnet.blockchain.info/rawtx/${assertionTransactionId}`;
        expect(certificate.rawTransactionLink).toEqual(rawTransactionLinkAssertion);
      });

      it('should set the transactionLink property', function () {
        const transactionLinkAssertion = `https://testnet.blockchain.info/tx/${assertionTransactionId}`;
        expect(certificate.transactionLink).toEqual(transactionLinkAssertion);
      });

      it('should set the verificationSteps property', function () {
        expect(certificate.verificationSteps).toEqual(verificationStepsV3);
      });
    });

    describe('retrieving the issuer profile - failing cases', function () {
      describe('when the issuer profile is undefined', function () {
        it('should throw an error', async function () {
          const failingFixture = JSON.parse(JSON.stringify(fixture));
          delete failingFixture.issuer;
          const certificate = new Certificate(failingFixture);
          await expect(certificate.init())
            .rejects
            .toThrow('Unable to get issuer profile - no issuer address given');
        });
      });

      describe('when the issuer profile is null', function () {
        it('should throw an error', async function () {
          const failingFixture = JSON.parse(JSON.stringify(fixture));
          failingFixture.issuer = null;
          const certificate = new Certificate(failingFixture);
          await expect(certificate.init())
            .rejects
            .toThrow('Unable to get issuer profile - no issuer address given');
        });
      });

      describe('when the issuer profile is an empty string', function () {
        it('should throw an error', async function () {
          const failingFixture = JSON.parse(JSON.stringify(fixture));
          failingFixture.issuer = '';
          const certificate = new Certificate(failingFixture);
          await expect(certificate.init())
            .rejects
            .toThrow('Unable to get issuer profile - no issuer address given');
        });
      });

      describe('when the issuer profile is not a valid URL', function () {
        it('should throw an error', async function () {
          const failingFixture = JSON.parse(JSON.stringify(fixture));
          failingFixture.issuer = 'this is not a URL';
          const certificate = new Certificate(failingFixture);
          await expect(certificate.init())
            .rejects
            .toThrow('Unable to get issuer profile - no issuer address given');
        });
      });

      describe('when the issuer profile URL yields a server error', function () {
        it('should throw an error', async function () {
          const failingFixture = JSON.parse(JSON.stringify(fixture));
          failingFixture.issuer += 'willfailfortests';
          const certificate = new Certificate(failingFixture);
          await expect(certificate.init())
            .rejects
            .toThrow('Unable to get issuer profile');
        });
      });

      describe('when the issuer profile URL is not of a issuer profile', function () {
        it('should throw an error', async function () {
          const failingFixture = JSON.parse(JSON.stringify(fixture));
          failingFixture.issuer = 'https://raw.githubusercontent.com/blockchain-certificates/cert-schema/master/cert_schema/3.0-alpha/context.json';
          const certificate = new Certificate(failingFixture);
          await expect(certificate.init())
            .rejects
            .toThrow('Unable to get issuer profile - retrieved file does not seem to be a valid profile');
        });
      });
    });
  });
});
