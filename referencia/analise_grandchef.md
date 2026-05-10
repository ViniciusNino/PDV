# Análise de Referência: GrandChef

Com base na análise do sistema GrandChef, este documento detalha as funcionalidades core e o roteiro de desenvolvimento para o PDV Híbrido Nino.

## 1. Módulos Principais (MVP)
Para atingir o nível de maturidade da referência, o projeto deve focar nos seguintes módulos:

### A. Frente de Caixa (PDV)
- Registro rápido de itens (teclado + leitor).
- Gestão de adicionais e observações.
- Múltiplas formas de pagamento (Pix, Cartão, Dinheiro).
- Sangria e Suprimento de caixa.

### B. Gestão de Mesas e Comandas
- Mapa de mesas visual.
- Abertura de comandas por QR Code ou número.
- Transferência de itens entre mesas.

### C. Delivery Integrado
- Recebimento de pedidos (iFood/Aiqfome).
- Gestão de status (Pendente -> Preparando -> Despachado).
- Controle de entregadores.

### D. Estoque e Financeiro
- Ficha técnica (ex: 1 Hambúrguer consome 1 Pão, 100g de Carne).
- Alerta de estoque baixo.
- Fluxo de caixa e DRE básica.

## 2. Diferenciais Técnicos (Benchmark)
- **Operação Local:** Uso de rede Wi-Fi local para que o app do garçom fale com o servidor da loja mesmo sem internet externa.
- **Impressão Multi-Ponto:** Direcionamento automático (ex: Bebidas para o bar, Comida para a cozinha).
- **Sincronismo Híbrido:** Ícone de status de conexão e fila de sincronização transparente para o usuário.

## 3. Passos para o Desenvolvimento (Roteiro)

### Fase 1: Infraestrutura e Base (Atual)
1. [ ] Setup do Monorepo e Projetos Base (.NET 8 + React + Electron).
2. [ ] Modelagem do Banco de Dados PostgreSQL (Local) com foco em UUIDs.
3. [ ] Implementação da Autenticação Híbrida (Login Online/Offline).

### Fase 2: Core PDV
4. [ ] Cadastro de Produtos e Categorias.
5. [ ] Interface de Venda Rápida (Frente de Caixa).
6. [ ] Módulo de Impressão Térmica (via Electron).

### Fase 3: Sincronização e Inteligência
7. [ ] Desenvolvimento do Background Worker para sincronismo com a Nuvem.
8. [ ] Lógica de resolução de conflitos (Client Wins).
9. [ ] Dashboard Web de Retaguarda (Relatórios).

### Fase 4: Expansão (Mesas e Delivery)
10. [ ] Mapa de Mesas e App Mobile para Garçom.
11. [ ] Integração com APIs de Delivery (iFood).
12. [ ] Emissão Fiscal (NFC-e/SAT).
