from transformers import LayoutLMForTokenClassification, LayoutLMTokenizer
import torch
import PyPDF2

# Load the model and tokenizer
model = LayoutLMForTokenClassification.from_pretrained("microsoft/layoutlm-base-uncased")
tokenizer = LayoutLMTokenizer.from_pretrained("microsoft/layoutlm-base-uncased")

def read_pdf(file_path: str) -> str:
    """Extract text from PDF file"""
    text = ""
    with open(file_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text()
    return text


def extract_information_from_resume(file_path: str):
    try:
        # Load and preprocess file
        text = read_pdf(file_path)
        print("Text is :" , text)


        # Tokenize and prepare inputs 
        # Converting our text into predefined Numerical Values
        tokens = tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            padding="max_length",
            max_length=512,
        )

        # Predicting which token is useful in our stuctured format 
        # And What is the token representing in a Probability Distribution 
        # The Heart of the Function
        outputs = model(**tokens)

        # Only Using the Max Probable labels and discarding the rest
        predictions = torch.argmax(outputs.logits, dim=2)

        # Tokens in Text Format
        decoded_tokens = tokenizer.convert_ids_to_tokens(tokens["input_ids"][0])
        
        # Predictions in List format
        predicted_labels = predictions[0].tolist()
        
        # Token with its Predicted Value
        token_label_pairs = list(zip(decoded_tokens, predicted_labels))

        # Stucturing the Data Tokens in right format
        structured_data = group_entities(token_label_pairs)

        
        print("Text" , text)
        print("Tokens" , tokens)
        print("Outputs" , outputs)
        print("Predictions" , predictions)
        print("Decoded Tokens" , decoded_tokens)
        print("Predicted Labels " , predicted_labels)
        print("Token Label Pairs" , token_label_pairs)
        print("Structured Format" , structured_data)
        # Process predictions
        return structured_data

    except FileNotFoundError:
        return {"error": "File not found. Please check the file path."}
    except RuntimeError as e:
        return {"error": f"Runtime error occurred: {str(e)}"}
    except Exception as e:
        return {"error": f"An unexpected error occurred: {str(e)}"}



def group_entities(token_label_pairs):

    label_mapping = {
        0: "O",           # Other (not relevant)
        1: "B-NAME",      # Beginning of a Name
        2: "B-EMAIL",     # Beginning of an Email
        3: "B-PHONE",     # Beginning of a Phone Number
        4: "B-EXP",       # Beginning of an Experience section
        5: "B-PROJECT",   # Beginning of a Project
        6: "B-EDUCATION", # Beginning of an Education section
    }


    structured_data = {
        "name": "",
        "email": "",
        "phone_number": "",
        "experiences": [],
        "projects": [],
        "education": []
    }
    
    current_label = None
    current_entity = []

    for token, label in token_label_pairs:
        label_name = label_mapping[label]

        if label_name.startswith("B-"):  # Begin a new entity
            # Save the previous entity
            if current_label:
                if current_label == "B-NAME":
                    structured_data["name"] = " ".join(current_entity)
                elif current_label == "B-EMAIL":
                    structured_data["email"] = " ".join(current_entity)
                elif current_label == "B-PHONE":
                    structured_data["phone_number"] = " ".join(current_entity)
                elif current_label == "B-EXP":
                    structured_data["experiences"].append(" ".join(current_entity))
                elif current_label == "B-PROJECT":
                    structured_data["projects"].append(" ".join(current_entity))
                elif current_label == "B-EDUCATION":
                    structured_data["education"].append(" ".join(current_entity))
            
            # Start a new entity
            current_label = label_name
            current_entity = [token]
        elif label_name == "O" and current_label:  # End current entity
            current_label = None
            current_entity = []
        elif current_label:  # Continue current entity
            current_entity.append(token)

    # Save the last entity
    if current_label:
        if current_label == "B-NAME":
            structured_data["name"] = " ".join(current_entity)
        elif current_label == "B-EMAIL":
            structured_data["email"] = " ".join(current_entity)
        elif current_label == "B-PHONE":
            structured_data["phone_number"] = " ".join(current_entity)
        elif current_label == "B-EXP":
            structured_data["experiences"].append(" ".join(current_entity))
        elif current_label == "B-PROJECT":
            structured_data["projects"].append(" ".join(current_entity))
        elif current_label == "B-EDUCATION":
            structured_data["education"].append(" ".join(current_entity))

    return structured_data


