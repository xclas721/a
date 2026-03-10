// src/mocks/handlers.js
import { http, HttpResponse } from 'msw'
import { appConfig } from '@/config'
const baseUrl = appConfig.API_BASE_URL
export const indexMock = [
  http.get(baseUrl + '/api/issuer/index/captcha', () => {
    return HttpResponse.json({
      code: 'evBB',
      expire: 6000,
      token: '1c6412ed76df4b70875d2d0bb3f68d93'
    })
  }),
  http.post(baseUrl + '/api/issuer/index/login-submit', () => {
    return HttpResponse.json({
      data: {
        token: 'db6057d8-3284-4ad7-839a-6e42ed23ea6d',
        loginSuccess: true,
        mfa: false,
        userName: '管理員喔',
        issuerOid: '22df320b-5cf2-d898-128a-846f75e56d07'
      },
      code: '0000',
      message: '',
      success: true
    })
  }),
  http.post(baseUrl + '/api/menu/getMenu', () => {
    return HttpResponse.json({
      data: [
        {
          oid: '7d2aa188-1650-9510-334b-43d0fe2c08ca',
          nodeType: 'M',
          accessId: 'system',
          i18nCode: 'ui.menu.sys',
          children: [
            {
              oid: 'b90c7b19-34f5-3a9e-38da-24a2fd89057e',
              nodeType: 'F',
              accessId: 'card_bin',
              i18nCode: 'ui.card-bin',
              children: null
            },
            {
              oid: 'b4452d94-e18e-58e8-5b20-211609f86222',
              nodeType: 'F',
              accessId: 'issuer_param',
              i18nCode: 'ui.issuer-param',
              children: null
            },
            {
              oid: 'a153dcd4-2058-aa67-74d1-6ba2e853963e',
              nodeType: 'F',
              accessId: 'currency_code',
              i18nCode: 'ui.currency',
              children: null
            },
            {
              oid: '870db3a6-1e49-b375-7194-405b66749efe',
              nodeType: 'F',
              accessId: 'card_scheme_param',
              i18nCode: 'ui.card-scheme-param',
              children: null
            },
            {
              oid: 'fd641a14-e016-d891-be3d-1e4bc7afbdf0',
              nodeType: 'F',
              accessId: 'issuer_query',
              i18nCode: 'ui.issuer-find',
              children: null
            },
            {
              oid: '25dd299e-9e33-d562-d3be-4219b7181f3e',
              nodeType: 'F',
              accessId: 'reconfirm',
              i18nCode: 'ui.reconfirm',
              children: null
            },
            {
              oid: '1f685515-352f-ec73-5eeb-4cd96c4a9047',
              nodeType: 'F',
              accessId: 'operation_log',
              i18nCode: 'ui.operation-log',
              children: null
            },
            {
              oid: 'dd0e8441-48be-a5c1-858a-69fcb20b8c03',
              nodeType: 'F',
              accessId: 'challenge_ui',
              i18nCode: 'ui.challenge-ui',
              children: null
            },
            {
              oid: 'b1f096aa-5260-5edf-113e-4fe4a3ca201a',
              nodeType: 'F',
              accessId: 'issuer',
              i18nCode: 'ui.issuer',
              children: null
            },
            {
              oid: 'b71dba17-b47e-08be-90f1-ed150e0d5867',
              nodeType: 'F',
              accessId: 'sys_code',
              i18nCode: 'ui.sys-code',
              children: null
            },
            {
              oid: '9e896531-94f5-9059-34b6-548472f7638c',
              nodeType: 'F',
              accessId: 'mcc_code',
              i18nCode: 'ui.mcc-code',
              children: null
            },
            {
              oid: 'c6c4fa13-afa9-e300-67f0-432fec12d685',
              nodeType: 'F',
              accessId: 'eea_region',
              i18nCode: 'ui.eea-region',
              children: null
            },
            {
              oid: '25310b26-97b1-aa4c-01ba-2b2ecacbb6d8',
              nodeType: 'F',
              accessId: 'issuer_reconfirm',
              i18nCode: 'ui.issuer-reconfirm',
              children: null
            }
          ]
        },
        {
          oid: 'e151f5bf-f3af-2281-d78c-33d9d50bf149',
          nodeType: 'M',
          accessId: 'privilege',
          i18nCode: 'ui.menu.privilege',
          children: [
            {
              oid: '344e0dcb-37b3-31cd-0b01-8c23b68734bd',
              nodeType: 'F',
              accessId: 'admin_group',
              i18nCode: 'ui.admin-group.management',
              children: null
            },
            {
              oid: 'bab1e22f-28a2-e9bb-1c94-3b6abb6b5bb6',
              nodeType: 'F',
              accessId: 'admin_group_query',
              i18nCode: 'ui.admin-group.opquery',
              children: null
            },
            {
              oid: 'a8f97f9c-2ca8-6d93-95fb-3a3f2108ae06',
              nodeType: 'F',
              accessId: 'admin_user',
              i18nCode: 'ui.admin-user.management',
              children: null
            },
            {
              oid: '17860910-92f3-1fc7-fa9e-cdc56de151d9',
              nodeType: 'F',
              accessId: 'admin_user_query',
              i18nCode: 'ui.admin-user.management-query',
              children: null
            },
            {
              oid: '3d8cb17a-e358-3872-63e3-7b12cfb688c4',
              nodeType: 'F',
              accessId: 'issuer_adm',
              i18nCode: 'ui.issuer-adm',
              children: null
            },
            {
              oid: '8b2c45bf-4f09-2f94-f62d-7578ee2a6c78',
              nodeType: 'F',
              accessId: 'issuer_adm_query',
              i18nCode: 'ui.issuer-adm-query',
              children: null
            },
            {
              oid: '06712e5b-050b-82f7-70bd-3d1af97c6e28',
              nodeType: 'F',
              accessId: 'issuer_group',
              i18nCode: 'ui.issuer-group.management',
              children: null
            },
            {
              oid: '8cc8e3c7-f0d6-3a83-7c02-6db765edc062',
              nodeType: 'F',
              accessId: 'issuer_group_query',
              i18nCode: 'ui.issuer-group.opquery',
              children: null
            },
            {
              oid: 'd3020995-6fc9-ae94-9531-c714d84e8d3f',
              nodeType: 'F',
              accessId: 'issuer_user',
              i18nCode: 'ui.issuer-user.adm',
              children: null
            },
            {
              oid: '6567c2b3-b52e-d5da-e1fb-c60670507f8c',
              nodeType: 'F',
              accessId: 'issuer_user_query',
              i18nCode: 'ui.issuer-user.opquery',
              children: null
            },
            {
              oid: 'e7b45e70-07f4-8599-8668-e1a42bd4753b',
              nodeType: 'F',
              accessId: 'user_reconfirm_privilege',
              i18nCode: 'ui.issuer-user-reconfirm-privilege',
              children: null
            }
          ]
        },
        {
          oid: 'f9ed7cdc-0c35-9953-d949-971b4eb913ab',
          nodeType: 'M',
          accessId: 'risk',
          i18nCode: 'ui.menu.risk',
          children: [
            {
              oid: '4a7ce0a5-42e6-1b9f-5822-2016054b6910',
              nodeType: 'F',
              accessId: 'issuer_attempt',
              i18nCode: 'ui.issuerAttempt',
              children: null
            },
            {
              oid: 'be89a3af-4d1e-e30f-4738-961cb4733a32',
              nodeType: 'F',
              accessId: 'issuer_risk',
              i18nCode: 'ui.risk-indicator',
              children: null
            },
            {
              oid: '45757797-3641-655b-2be9-d4e76c5bc92d',
              nodeType: 'F',
              accessId: 'mcc_risk',
              i18nCode: 'ui.mcc-risk',
              children: null
            },
            {
              oid: 'e11e877d-02c6-28f0-f419-cfc5a4fc4e51',
              nodeType: 'F',
              accessId: 'black_list',
              i18nCode: 'ui.black-list',
              children: null
            },
            {
              oid: 'a459f73c-737e-1d11-9d2d-f87211fb2484',
              nodeType: 'F',
              accessId: 'mc_rba_config',
              i18nCode: 'ui.mc-rba',
              children: null
            },
            {
              oid: 'b6bd4791-8b64-031e-f5d8-a17f82500f69',
              nodeType: 'F',
              accessId: 'visa_rba_config',
              i18nCode: 'ui.visa-rba',
              children: null
            },
            {
              oid: 'b08d615e-4e2e-c349-a057-5a1faa465d97',
              nodeType: 'F',
              accessId: 'rba_trans_blacklist_query',
              i18nCode: 'ui.report.rba-trans-blacklist',
              children: null
            },
            {
              oid: 'e423513c-afea-b191-f236-6e76503f70e1',
              nodeType: 'F',
              accessId: 'rba_reason_query',
              i18nCode: 'ui.report.rba-trans-reason',
              children: null
            },
            {
              oid: 'eb8dfe94-aa84-8799-c631-c7db928626aa',
              nodeType: 'F',
              accessId: 'rba_trans_risk_query',
              i18nCode: 'ui.report.rba-trans-risk',
              children: null
            },
            {
              oid: '2e63dfec-a787-ca39-9590-a60f088b7f3c',
              nodeType: 'F',
              accessId: 'issuer_mer_whitelist',
              i18nCode: 'ui.issuer-mer-whitelist',
              children: null
            }
          ]
        },
        {
          oid: '8d32fa36-09b0-cf56-891e-5498219a9bd3',
          nodeType: 'M',
          accessId: 'trans',
          i18nCode: 'ui.menu.trans',
          children: [
            {
              oid: 'dcf24f20-671f-ad9f-214a-65dbe34d6bfc',
              nodeType: 'F',
              accessId: 'issuer_transaction',
              i18nCode: 'trans.log.query',
              children: null
            },
            {
              oid: '932dfc2d-db0b-6c04-5c57-fd18cfecac97',
              nodeType: 'F',
              accessId: 'abnormal_trans_log',
              i18nCode: 'ui.abnormal.trans.log',
              children: null
            },
            {
              oid: '7ec2e34b-2475-1356-482a-699652da8ce4',
              nodeType: 'F',
              accessId: 'card_organization_trans_query',
              i18nCode: 'ui.meun.card-organization-trans-query',
              children: null
            },
            {
              oid: '7f63635e-b938-aba8-db99-7f204976adc2',
              nodeType: 'F',
              accessId: 'trans_error_detail_query',
              i18nCode: 'ui.meun.error-detail-reason-query',
              children: null
            },
            {
              oid: '499dc637-f9bf-843d-1e8d-0d4b395f1af4',
              nodeType: 'F',
              accessId: 'trans_performance_monitor',
              i18nCode: 'ui.menu.trans_performance_monitor',
              children: null
            }
          ]
        },
        {
          oid: '808832a0-9470-c075-2306-14e16d492b50',
          nodeType: 'M',
          accessId: 'cardholder',
          i18nCode: 'ui.cardholder-data',
          children: [
            {
              oid: 'd737963e-399c-1150-3b1b-dfa7f6a6728a',
              nodeType: 'F',
              accessId: 'cardholder',
              i18nCode: 'ui.cardholder-data',
              children: null
            },
            {
              oid: '42e75cc8-98e2-62ca-1b70-a66fd4e61ee2',
              nodeType: 'F',
              accessId: 'cardholder_on_off',
              i18nCode: 'ui.cardholder-status-on-off',
              children: null
            },
            {
              oid: 'e68ba96d-c94b-07bf-2149-2dd4d4139a91',
              nodeType: 'F',
              accessId: 'cardholder_unlock',
              i18nCode: 'ui.cardholder-status-unlock',
              children: null
            },
            {
              oid: 'b089a6e0-9226-3bf5-7cf2-e673c18e4469',
              nodeType: 'F',
              accessId: 'cardholder_attempt',
              i18nCode: 'ui.cardholder3DSAttempt.management',
              children: null
            },
            {
              oid: 'd522d8f7-5ac8-53d9-5a63-99292222cb89',
              nodeType: 'F',
              accessId: 'cardholder_mer_whitelist',
              i18nCode: 'ui.cardholder-mer-whitelisting',
              children: null
            }
          ]
        },
        {
          oid: '313746d3-c322-72fa-2565-2325ceceb970',
          nodeType: 'M',
          accessId: 'key',
          i18nCode: 'ui.menu.key',
          children: [
            {
              oid: '9b34933e-ccfc-fedd-3bf3-b6a4c3940f60',
              nodeType: 'F',
              accessId: 'cavv_key',
              i18nCode: 'ui.cavv-key',
              children: null
            },
            {
              oid: 'cc3efe4b-c4c2-ba24-6bfb-310736473784',
              nodeType: 'F',
              accessId: 'kek',
              i18nCode: 'ui.kek',
              children: null
            },
            {
              oid: 'fc3eec84-5ef6-dce6-9d16-66cf872a9212',
              nodeType: 'F',
              accessId: 'cek',
              i18nCode: 'ui.cek',
              children: null
            }
          ]
        },
        {
          oid: 'b75c02af-3386-06f2-58c0-1d093f856aa2',
          nodeType: 'M',
          accessId: 'certificate',
          i18nCode: 'ui.menu.certificate',
          children: [
            {
              oid: '0e21b59b-4964-42e4-0bd6-2844efc52d74',
              nodeType: 'F',
              accessId: 'sign_csr',
              i18nCode: 'ui.certificate-quest',
              children: null
            },
            {
              oid: 'e138339c-04e6-ab50-150f-5cbfb347b40d',
              nodeType: 'F',
              accessId: 'sign_cert_load',
              i18nCode: 'ui.issuer-cert.Signature',
              children: null
            },
            {
              oid: '01bb93dc-7fbf-3e22-ea6d-f54b4e902bb4',
              nodeType: 'F',
              accessId: 'sign_cert_query',
              i18nCode: 'ui.issuer-cert.query',
              children: null
            },
            {
              oid: '511f5dd5-3eff-f488-8a99-613ec90042ec',
              nodeType: 'F',
              accessId: 'sign_cert_activate',
              i18nCode: 'ui.issuer-cert.open',
              children: null
            },
            {
              oid: '8bec5803-cc97-f467-446b-3892a1346a39',
              nodeType: 'F',
              accessId: 'sign_cert_management',
              i18nCode: 'ui.issuer-cert.management',
              children: null
            },
            {
              oid: 'c8361e5d-9173-12fc-a1f0-4af62dacdd1d',
              nodeType: 'F',
              accessId: 'ds_csr',
              i18nCode: 'ui.ds-client-certificate-quest',
              children: null
            },
            {
              oid: '9c10fcab-bbdf-aa3f-c1f6-fae5d18776d8',
              nodeType: 'F',
              accessId: 'ds_cert_load',
              i18nCode: 'ui.ds-issuer-cert.Signature',
              children: null
            },
            {
              oid: '94197ada-b488-2848-536a-77aacd3f3711',
              nodeType: 'F',
              accessId: 'ds_cert_query',
              i18nCode: 'ui.ds-issuer-cert.query',
              children: null
            },
            {
              oid: 'bf94301e-80e0-4af9-23be-540ddad7a0f7',
              nodeType: 'F',
              accessId: 'ds_cert_activate',
              i18nCode: 'ui.ds-issuer-cert.open',
              children: null
            },
            {
              oid: '54332e72-78f9-3163-549d-2e08b91eddb1',
              nodeType: 'F',
              accessId: 'ds_cert_management',
              i18nCode: 'ui.ds-issuer-cert.management',
              children: null
            },
            {
              oid: '060f4527-5d1b-5b34-0297-14bc88073fa3',
              nodeType: 'F',
              accessId: 'ca_cert_load',
              i18nCode: 'ui.ca-cert-certificate',
              children: null
            },
            {
              oid: 'ca2f6ed6-cfbc-cc04-1428-ba6f4f20a5ff',
              nodeType: 'F',
              accessId: 'ca_cert_query',
              i18nCode: 'ui.ca-cert-certificate-find',
              children: null
            }
          ]
        },
        {
          oid: '7bd8ebd1-368d-d6ae-9aec-8eb6e74c0454',
          nodeType: 'M',
          accessId: 'ext',
          i18nCode: 'ui.menu.visa.ext',
          children: [
            {
              oid: 'c1896358-efe4-2171-428c-9cde613b386f',
              nodeType: 'F',
              accessId: 'daf_acct_setup',
              i18nCode: 'ui.menu.daf_acct_setup',
              children: null
            },
            {
              oid: '1620370d-56f8-c6f0-7fcf-31cc5460466c',
              nodeType: 'F',
              accessId: 'daf_trans_report',
              i18nCode: 'ui.menu.trans_status_stats',
              children: null
            },
            {
              oid: '06587690-3f0b-4415-2799-905beddf414d',
              nodeType: 'F',
              accessId: 'daf_advice_report',
              i18nCode: 'ui.menu.daf_advice_stats',
              children: null
            },
            {
              oid: 'dd859933-2ea9-5245-ebca-75e65c5023e2',
              nodeType: 'F',
              accessId: 'visa_rba_anlys_report',
              i18nCode: 'ui.meun.visa-score-anlys',
              children: null
            }
          ]
        }
      ],
      code: '0000',
      message: '',
      success: true
    })
  })
]
