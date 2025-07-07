# 내 Odoo 앱

이 모듈은 Odoo 커스텀 애플리케이션의 기본 틀입니다.

## 기능

- 기본 모델 (`my.model`) 구현
- 사용자 권한 관리
- 웹 컨트롤러 예시
- 완전한 CRUD 인터페이스

## 설치

1. 이 모듈을 Odoo addons 경로에 복사
2. Odoo에서 앱 업데이트
3. "내 앱" 모듈 설치

## 사용법

1. 메인 메뉴에서 "내 앱" 선택
2. "내 모델" 메뉴에서 데이터 관리
3. 새 레코드 생성, 편집, 삭제 가능

## 개발

### 모델 추가
`models/` 폴더에 새 모델 파일 생성

### 뷰 수정
`views/` 폴더의 XML 파일 수정

### 권한 설정
`security/` 폴더의 파일 수정

## 구조

```
my_app/
├── __init__.py
├── __manifest__.py
├── models/
│   ├── __init__.py
│   └── models.py
├── controllers/
│   ├── __init__.py
│   └── controllers.py
├── views/
│   ├── menu.xml
│   └── views.xml
├── security/
│   ├── security.xml
│   └── ir.model.access.csv
├── demo/
│   └── demo.xml
└── README.md
``` 