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
- Foco inicial em Banco de Dados e API de sincronização.