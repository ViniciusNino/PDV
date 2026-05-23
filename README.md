# Contexto do Projeto: PDV Híbrido .NET + React

## Stack Tecnológica
- **Backend:** API ASP.NET Core 8+ (C#)
- **Banco de Dados:** PostgreSQL (Local com sincronização em nuvem)
- **Frontend Web/Desktop:** React + Electron (JavaScript/TypeScript)
- **Frontend Mobile:** React Native (Expo)
- **Comunicação Real-time:** SignalR (.NET Hub)

## Requisitos de Arquitetura
1. **Funcionamento Offline:** O sistema deve operar via Wi-Fi local se a internet cair.
2. **Sincronização:** Worker Service no .NET para replicar dados locais para a nuvem.
3. **Repositório:** Monorepo (Back e Front na mesma estrutura).
4. **Hardware:** Integração via Electron para impressoras térmicas e balanças.

## Estratégia de Desenvolvimento
- Mapeamento de sistema base "tela por tela".
- Tela inicial de login com foco em desktop com teclado, mas funcional em mobile
- Tela de checkout com foco em desktop com teclado, mas funcional em mobile

## Estrutura do Monorepo (Proposta)
```text
/nino-pdv
├── /backend            # API ASP.NET Core 8
├── /frontend-desktop   # React + Electron
├── /frontend-mobile    # React Native (Expo)
└── /shared             # Contratos, Enums e Tipos compartilhados
```

## Estratégia de Sincronização e Conflitos
1. **Identificadores:** Uso obrigatório de `UUID/GUID` para todas as chaves primárias para evitar colisões entre bases locais e nuvem.
2. **Controle de Versão:** Cada registro terá uma coluna `UpdatedAt` e `Version` (concurrency token).
3. **Fluxo de Sincronização:**
    - **Local para Nuvem (Push):** Worker service monitora registros com `IsSynced = false`.
    - **Nuvem para Local (Pull):** API local busca alterações baseada no `LastSyncTimestamp`.
4. **Resolução de Conflitos:** Estratégia "Client Wins" (PDV local tem prioridade sobre o estado da nuvem em caso de divergência de vendas), ou "Last Write Wins" para cadastros de produtos.

## Estratégia de Autenticação Híbrida
1. **Login Inicial (Online):** Credenciais validadas na nuvem; Token e permissões são cacheados localmente.
2. **Login Offline:** A API local valida o hash da senha contra o banco local e emite um Token JWT local.
3. **Persistência de Sessão:** O cache local de credenciais é atualizado sempre que o sistema recupera a conexão.
4. **Segurança Local:** As Roles/Permissões são verificadas localmente para autorizar operações críticas (ex: cancelamentos) sem internet.

## Como Executar o Projeto

Para instruções completas de como configurar dependências, rodar o banco de dados PostgreSQL e iniciar o backend e os frontends pela primeira vez, consulte o guia passo a passo em [COMO_RODAR.md](file:///d:/Nino%20Programas/PDV/COMO_RODAR.md).