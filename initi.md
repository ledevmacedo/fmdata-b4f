# Recriar este repositório.

### Passo a Passo para recriar este repositório até o ponto atual!

### 1 - Criar um repositório github.
1. Crie um repositório no github com o nome de tua preferencia **sem o README.md**
2. Abra o repositório no vscode
3. Verifique o unico arquivo é o .gitattributes, se sim, pode seguir ao proximo passo, outros arquivos que nao sejam esse.
4. Publique o repositorio.

### 2 - Instalando as dependencias - NextJS

1. Execute o comando o terminal do repo no vscode `npx create-next-app@latest`
2. quando perguntarem o nome do projeto "What is your project named?" digite apenas ponto `.` isso fará o nextjs assumir que o nome do projeto é o mesmo que o da pasta.
3. Vão perguntar sobre as configurações recomendadas, diga que que a opção custom. `No, customize settings`
4. Após isso, responda todas as perguntas de acordo com o documento abaixo:
```shell
√ Would you like to use TypeScript? ... No / **Yes**
√ Which linter would you like to use? » **Biome**
√ Would you like to use React Compiler? ... **No** / Yes
√ Would you like to use Tailwind CSS? ... No / **Yes**
√ Would you like your code inside a `src/` directory? ... No / **Yes**
√ Would you like to use App Router? (recommended) ... No / **Yes**
√ Would you like to use Cache Components? ... No / **Yes**
√ Would you like to customize the import alias (`@/*` by default)? ... **No** / Yes
√ Would you like to include AGENTS.md to guide coding agents to write up-to-date Next.js code? ... No / **Yes**
√ Would you like to help improve Next.js by letting agents prepare anonymized feedback for your review as you code? (Disable anytime with `experimental.agentFeedback: false`.) ... No / **Yes**
```

5. Aceda ao em src\app\page.tsx e remova o conteudo dentro do return, mantendo apenas um diff.
6. Faça commit e push