# Introducing High School Students to Git, CI, and QA

This tutorial project is designed to guide new developers through:
- Version Control with Git
- Continuous Integration (CI)
- Quality Assurance (QA)

## Part 1: Version Control with Git

1. Initialize Git:
   - `git init`
2. Configure username/email:
   - `git config --global user.name "Your Name"`
   - `git config --global user.email "you@example.com"`
3. Stage and commit:
   - `git add .`
   - `git commit -m "initial project commit"`
4. Push to remote:
   - `git remote add origin <your-repo-url>`
   - `git push -u origin main`
5. Explore collaboration:
   - `git checkout -b feature/add-math-func`
   - make change, `git commit`
   - `git push -u origin feature/add-math-func`
   - open Pull Request on GitHub
   - pull changes from peers: `git pull`
   - resolve merge conflicts if needed

## Part 2: Continuous Integration (CI)

This project uses GitHub Actions in `.github/workflows/ci.yml`:
- runs on each push and pull request
- installs dependencies
- runs lint (`npm run lint`)
- runs tests (`npm test`)

## Part 3: Quality Assurance (QA)

1. Unit tests live in `tests/`.
2. Linter config in `.eslintrc.json`.
3. Use PRs for code review.

### How to add new tests
- Add code in `src/`.
- Add test in `tests/`.
- Run `npm test` locally.
- Commit and push.

---

## Quick Start

```bash
cd introducingHighSchoolStudents
npm install
npm test
npm run lint
```
