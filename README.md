## Giới thiệu
- Hệ thống mkt platform build thành sdk js
## Code rules

Bộ source code có dùng 2 libs linter để check code validate. Và được build vào git hooks bằng [husky](https://github.com/typicode/husky)
1. Eslint JS https://github.com/eslint/eslint
2. Commit-msg https://github.com/marionebl/commitlint

> Nội dung commit tuân theo cấu trúc sau:
> `` type: subject ``
>
>- Type: là kiểu commit (build | ci | docs | feat | fix | revert | style | test)
>- Subject: là nội dung commit.
>
>Ví dụ: ``build: web-123``
