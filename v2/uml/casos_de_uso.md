# Diagrama de Casos de Uso - Relacionamento com Interface de Usuário (IU)

Este documento apresenta o diagrama de casos de uso do sistema **Meu Índice de Preço**, mapeando as funcionalidades com seus respectivos componentes visuais e rotas do frontend.

Refere-se à plataforma web para acompanhamento da inflação local em Morrinhos-GO, contemplando as áreas públicas e a área administrativa.

## Diagrama Visual (Mermaid)

O diagrama abaixo utiliza `mermaid` (renderizado nativamente no GitHub e em editores compatíveis):

```mermaid
flowchart LR
    %% Atores
    Cidadao([Cidadão / Usuário])
    Docente([Docente / Pesquisador do Projeto])
    
    %% Fronteira do Sistema
    subgraph Portal [Meu Índice de Preço - Portal Web]
        direction TB
        UC01(["UC01 - Consultar Inflação\n(/inflacao - PainelInflacao)"])
        UC02(["UC02 - Inflação Pessoal\n(/simulador - SimuladorPessoal)"])
        UC03(["UC03 - Envio de Feedback\n(/contato - ContatoDeFeedback)"])
        UC04(["UC04 - Login Docente\n(/admin/login - Admin.tsx)"])
        UC05(["UC05 - Cadastro de Preços\n(/admin/coleta - GestaoColetas)"])
    end
    
    %% Interação dos Atores
    Cidadao --> UC01
    Cidadao --> UC02
    Cidadao --> UC03
    
    Docente --> UC04
    Docente --> UC05
    
    %% Relação (Para acessar o cadastro, precisa do login)
    UC05 -. "<<include>>" .-> UC04
```

---

## Código PlantUML

Para ferramentas que suportam **PlantUML**, o código abaixo gera o diagrama de uso formal completo:

```plantuml
@startuml
left to right direction
skinparam packageStyle rectangle

actor "Cidadão / Usuário" as cidadao
actor "Docente / Pesquisador" as docente

rectangle "Meu Índice de Preço (Plataforma Web)" {
  usecase "UC01\nConsultar Inflação\n<<PainelInflacao>>" as UC01
  usecase "UC02\nInflação Pessoal\n<<SimuladorPessoal>>" as UC02
  usecase "UC03\nEnvio de Feedback\n<<ContatoDeFeedback>>" as UC03
  usecase "UC04\nLogin Docente\n<<Admin.tsx>>" as UC04
  usecase "UC05\nCadastro de Preços\n<<GestaoColetas>>" as UC05
}

' Relacionamentos com os Atores
cidadao --> UC01
cidadao --> UC02
cidadao --> UC03

docente --> UC04
docente --> UC05

' O cadastro de preços inclui obrigatoriamente a autenticação
UC05 ..> UC04 : <<include>>

note right of UC02 : O usuário ajusta a quantidade padrão\ne aplica os pesos para gerar a taxa final.
note bottom of UC05 : Tela operada apenas pelos pesquisadores.\nPermite injeção em lote das buscas a cada 15 dias.

@enduml
```

## Tabela de Relacionamento IU com Casos de Uso

| Caso de Uso Principal | Interface (Path/Component) | Descrição do Fluxo |
| :--- | :--- | :--- |
| **UC01 - Consultar Inflação** | `/inflacao` (`PainelInflacao`) | Página pública inicial para leitura. Renderiza gráficos estáticos das 30 mercadorias avaliadas em Morrinhos. |
| **UC02 - Inflação Pessoal** | `/simulador` (`SimuladorPessoal`) | Calculadora dinâmica. O usuário ajusta a quantidade padrão e aplica os pesos para gerar a taxa final para si. |
| **UC03 - Envio de Feedback** | `/contato` (`ContatoDeFeedback`) | Formulário acessível onde os usuários da comunidade reportam problemas ou relatam uso prático. |
| **UC04 - Login Docente** | `/admin/login` (`Admin.tsx`) | Barreira de proteção SSL para autenticação e gestão. |
| **UC05 - Cadastro de Preços** | `/admin/coleta` (`GestaoColetas`) | Tela operada apenas pelos pesquisadores. Permite injeção em lote das buscas a cada 15 dias. |
