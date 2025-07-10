/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";

class CancelCreate extends Component {
    static template = "AutoloadSolution.Page01CancelCreate";
    
    setup() {
        this.state = useState({
            ownerName: "",
            SSN: "",
            address: "",
            email: "",
            phoneNumber: "",
            registration_no: "",
            vehicle_id: "",
            mileage: "",
            uploadedImage: null,
            currentPage: "inquiry",
            isProcessing: false,
        });
    }

    handleInputChange(field, value) {
        this.state[field] = value;
    }



    async handleSubmit(ev) {
        ev.preventDefault();
        
        // 필수 필드 검증
        if (!this.state.ownerName || !this.state.SSN || !this.state.address || 
            !this.state.email || !this.state.phoneNumber || !this.state.registration_no || 
            !this.state.vehicle_id || !this.state.mileage) {
            alert("모든 필수 항목을 입력해주세요.");
            return;
        }

        this.state.isProcessing = true;
        
        try {
            // API 요청 데이터 준비
            const cancelData = {
                owner_name: this.state.ownerName,
                ssn: this.state.SSN,
                address: this.state.address,
                email: this.state.email,
                phone_number: this.state.phoneNumber,
                registration_no: this.state.registration_no,
                vehicle_id: this.state.vehicle_id,
                mileage: parseInt(this.state.mileage) || 0,
            };

            // fetch를 사용하여 컨트롤러 API 호출
            const response = await fetch('/autoloadsolution/cancel/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: cancelData,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.error.data.message || result.error.message);
            }

            if (result.result && result.result.error) {
                alert(`저장 실패: ${result.result.error}`);
                return;
            }

            console.log("말소 데이터 저장 성공:", result.result);
            alert("말소 정보가 저장되었습니다. 관리 페이지로 이동합니다.");
            
            // 폼 초기화
            this.handleReset();
            
            // cancel_manage 페이지로 이동
            this.navigateToManage();
            
        } catch (error) {
            console.error("API 호출 실패:", error);
            alert("저장 중 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            this.state.isProcessing = false;
        }
    }





    navigateToManage() {
        // Odoo의 액션 시스템을 사용하여 페이지 이동
        const action = {
            type: 'ir.actions.client',
            tag: 'AutoloadSolution.cancel_manage'
        };
        
        // 현재 환경에서 액션 실행
        if (this.env && this.env.services && this.env.services.action) {
            this.env.services.action.doAction(action);
        } else {
            // 대체 방법: URL 변경
            window.location.hash = '#cancel_manage';
            // 페이지 새로고침으로 강제 이동
            setTimeout(() => {
                window.location.reload();
            }, 100);
        }
    }

    handleReset() {
        this.state.ownerName = "";
        this.state.SSN = "";
        this.state.address = "";
        this.state.email = "";
        this.state.phoneNumber = "";
        this.state.registration_no = "";
        this.state.vehicle_id = "";
        this.state.mileage = "";
        this.state.uploadedImage = null;
    }

    handleAddClick() {
        this.state.currentPage = "input";
    }

    handleBack() {
        this.state.currentPage = "inquiry";
    }

    handleImageUpload() {
        document.getElementById("imageUpload")?.click();
    }

    handleImageChange(ev) {
        const file = ev.target.files && ev.target.files[0];
        if (file) {
            this.state.uploadedImage = file;
            alert(`이미지가 업로드되었습니다: ${file.name}`);
        }
    }

    // 카메라로 사진 촬영
    handlePhotoRegistration() {
        // 숨겨진 파일 입력 요소 생성
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.capture = 'environment'; // 후면 카메라 사용
        fileInput.style.display = 'none';
        
        fileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                this.processImageWithOCR(file);
            }
            
            // 임시 요소 제거
            try {
                document.body.removeChild(fileInput);
            } catch (e) {
                // 무시
            }
        };
        
        fileInput.onerror = (event) => {
            // 오류 처리
        };
        
        // 파일 입력을 DOM에 추가하고 클릭
        document.body.appendChild(fileInput);
        fileInput.click();
    }

    // OCR API 호출
    async processImageWithOCR(imageBlob) {
        // 파일 크기 확인 (10MB 제한)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (imageBlob.size > maxSize) {
            // 이미지 압축 시도
            const compressedBlob = await this.compressImage(imageBlob);
            if (compressedBlob) {
                imageBlob = compressedBlob;
            }
        }
        
        try {
            this.state.isProcessing = true;
            
            // FormData 생성
            const formData = new FormData();
            formData.append('file', imageBlob, 'captured_image.png');
            formData.append('form_type', 'apply');
            
            // API 호출
            const response = await fetch('http://192.168.0.41:8000/ocr/upload', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                },
                body: formData
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
            }
            
            const result = await response.json();
            
            // 결과를 폼에 자동 입력
            this.fillFormWithOCRResult(result.parsed);
            
        } catch (error) {
            console.error('OCR 처리 실패:', error);
            alert('이미지 처리 중 오류가 발생했습니다: ' + error.message);
        } finally {
            this.state.isProcessing = false;
        }
    }

    // XMLHttpRequest를 사용한 대안 OCR 호출
    tryWithXMLHttpRequest(formData) {
        const xhr = new XMLHttpRequest();
        
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        const result = JSON.parse(xhr.responseText);
                        this.fillFormWithOCRResult(result.parsed);
                    } catch (parseError) {
                        console.error('JSON 파싱 실패:', parseError);
                    }
                } else {
                    console.error('HTTP 오류:', xhr.status);
                }
            }
        };
        
        xhr.onerror = (error) => {
            console.error('XHR 오류:', error);
        };
        
        xhr.ontimeout = () => {
            console.error('XHR 타임아웃');
        };
        
        xhr.open('POST', 'http://192.168.0.41:8000/ocr/upload', true);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.timeout = 30000; // 30초 타임아웃
        
        xhr.send(formData);
    }

    // 이미지 압축 메서드
    async compressImage(imageBlob) {
        try {
            // Canvas를 사용하여 이미지 압축
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            return new Promise((resolve) => {
                img.onload = () => {
                    // 이미지 크기 조정 (최대 1024px)
                    const maxSize = 1024;
                    let { width, height } = img;
                    
                    if (width > height) {
                        if (width > maxSize) {
                            height = (height * maxSize) / width;
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width = (width * maxSize) / height;
                            height = maxSize;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    // 이미지 그리기
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // JPEG로 압축 (품질 0.7)
                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/jpeg', 0.7);
                };
                
                img.onerror = () => {
                    resolve(null);
                };
                
                img.src = URL.createObjectURL(imageBlob);
            });
            
        } catch (error) {
            console.error('이미지 압축 실패:', error);
            return null;
        }
    }

    // OCR 결과를 폼에 자동 입력
    fillFormWithOCRResult(parsedData) {
        if (!parsedData) {
            return;
        }
        
        try {
            // 소유자명
            if (parsedData.ownerName) {
                this.state.ownerName = parsedData.ownerName.trim();
            }
            
            // 주민등록번호
            if (parsedData.SSN) {
                this.state.SSN = parsedData.SSN.trim();
            }
            
            // 주소
            if (parsedData.address) {
                this.state.address = parsedData.address.trim();
            }
            
            // 이메일
            if (parsedData.email) {
                this.state.email = parsedData.email.trim();
            }
            
            // 전화번호
            if (parsedData.phoneNumber) {
                this.state.phoneNumber = parsedData.phoneNumber.trim();
            }
            
            // 자동차등록번호
            if (parsedData.registration_no) {
                this.state.registration_no = parsedData.registration_no.trim();
            }
            
            // 차대번호
            if (parsedData.vehicle_id) {
                this.state.vehicle_id = parsedData.vehicle_id.trim();
            }
            
            // 주행거리
            if (parsedData.mileage) {
                this.state.mileage = parsedData.mileage.toString();
            }
            
            alert('이미지에서 정보를 추출하여 폼에 입력했습니다.');
            
        } catch (error) {
            console.error('폼 입력 중 오류:', error);
        }
    }

    // 사진으로 업로드하기 버튼 클릭 핸들러 (이미 위에서 구현됨)
}

registry.category("actions").add("AutoloadSolution.cancel_create", CancelCreate); 