package br.com.meuprojeto.portal_estagios.service;

import br.com.meuprojeto.portal_estagios.entity.Student;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.draw.LineSeparator;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

/**
 * Serviço responsável pela geração de currículos em PDF.
 */
@Service
@RequiredArgsConstructor
public class ResumeService {

    private final StudentService studentService;
    private static final Font TITLE_FONT = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, BaseColor.DARK_GRAY);
    private static final Font SECTION_FONT = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD, BaseColor.DARK_GRAY);
    private static final Font SUBTITLE_FONT = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, BaseColor.DARK_GRAY);
    private static final Font NORMAL_FONT = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL);
    private static final Font BOLD_FONT = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MM/yyyy");

    /**
     * Gera um currículo em PDF para um estudante específico.
     * 
     * @param studentId ID do estudante
     * @return Array de bytes do PDF gerado
     * @throws EntityNotFoundException se o estudante não for encontrado
     * @throws DocumentException       se ocorrer um erro na geração do documento
     */
    public byte[] generateResume(Long studentId) throws DocumentException, IOException {
        Student student = studentService.buscarPorIdOuFalhar(studentId);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, outputStream);

        document.open();

        // Informações pessoais
        addPersonalInfo(document, student);

        // Resumo
        if (student.getResumo() != null && !student.getResumo().isEmpty()) {
            addSection(document, "Resumo Profissional");
            document.add(new Paragraph(student.getResumo(), NORMAL_FONT));
            document.add(Chunk.NEWLINE);
        }

        // Formação
        if (student.getEducacao() != null && !student.getEducacao().isEmpty()) {
            addSection(document, "Formação Acadêmica");
            student.getEducacao().forEach(education -> {
                try {
                    String periodo = formatPeriodo(
                            education.getDataInicio() != null ? DATE_FORMATTER.format(education.getDataInicio()) : "",
                            education.getDataFim() != null ? DATE_FORMATTER.format(education.getDataFim()) : "",
                            education.isEmAndamento());

                    Paragraph educationTitle = new Paragraph(education.getNivel() + " em " + education.getCurso(),
                            SUBTITLE_FONT);
                    document.add(educationTitle);

                    Paragraph institution = new Paragraph(education.getInstituicao() + " | " + periodo, NORMAL_FONT);
                    document.add(institution);

                    if (education.getDescricao() != null && !education.getDescricao().isEmpty()) {
                        document.add(new Paragraph(education.getDescricao(), NORMAL_FONT));
                    }

                    document.add(Chunk.NEWLINE);
                } catch (DocumentException e) {
                    throw new RuntimeException("Erro ao adicionar formação acadêmica", e);
                }
            });
        }

    
        if (student.getExperiencia() != null && !student.getExperiencia().isEmpty()) {
            addSection(document, "Experiência Profissional");
            student.getExperiencia().forEach(experience -> {
                try {
                    String periodo = formatPeriodo(
                            experience.getDataInicio() != null ? DATE_FORMATTER.format(experience.getDataInicio()) : "",
                            experience.getDataFim() != null ? DATE_FORMATTER.format(experience.getDataFim()) : "",
                            experience.isAtual());

                    Paragraph experienceTitle = new Paragraph(experience.getCargo(), SUBTITLE_FONT);
                    document.add(experienceTitle);

                    Paragraph company = new Paragraph(experience.getEmpresa() + " | " + periodo, NORMAL_FONT);
                    document.add(company);

                    if (experience.getDescricao() != null && !experience.getDescricao().isEmpty()) {
                        document.add(new Paragraph(experience.getDescricao(), NORMAL_FONT));
                    }

                    document.add(Chunk.NEWLINE);
                } catch (DocumentException e) {
                    throw new RuntimeException("Erro ao adicionar experiência profissional", e);
                }
            });
        }

        if (student.getHabilidades() != null && !student.getHabilidades().isEmpty()) {
            addSection(document, "Habilidades");

            PdfPTable table = new PdfPTable(3);
            table.setWidthPercentage(100);

          
            PdfPCell headerCell1 = new PdfPCell(new Phrase("Habilidade", BOLD_FONT));
            PdfPCell headerCell2 = new PdfPCell(new Phrase("Nível", BOLD_FONT));
            PdfPCell headerCell3 = new PdfPCell(new Phrase("Categoria", BOLD_FONT));

            headerCell1.setBackgroundColor(BaseColor.LIGHT_GRAY);
            headerCell2.setBackgroundColor(BaseColor.LIGHT_GRAY);
            headerCell3.setBackgroundColor(BaseColor.LIGHT_GRAY);

            table.addCell(headerCell1);
            table.addCell(headerCell2);
            table.addCell(headerCell3);

        
            student.getHabilidades().forEach(skill -> {
                table.addCell(new Phrase(skill.getNome(), NORMAL_FONT));
                table.addCell(new Phrase(formatSkillLevel(skill.getNivel()), NORMAL_FONT));
                table.addCell(new Phrase(skill.getCategoria(), NORMAL_FONT));
            });

            document.add(table);
            document.add(Chunk.NEWLINE);
        }


        if (student.getAreasInteresse() != null && !student.getAreasInteresse().isEmpty()) {
            addSection(document, "Áreas de Interesse");
            Paragraph areas = new Paragraph();
            student.getAreasInteresse().forEach(area -> areas.add(new Chunk(area.getNome() + ", ", NORMAL_FONT)));

            String areasText = areas.getContent().toString();
            if (areasText.endsWith(", ")) {
                areasText = areasText.substring(0, areasText.length() - 2);
            }

            document.add(new Paragraph(areasText, NORMAL_FONT));
            document.add(Chunk.NEWLINE);
        }

  
        addLinks(document, student);

        document.close();
        return outputStream.toByteArray();
    }

    private void addPersonalInfo(Document document, Student student) throws DocumentException {
        
        Paragraph name = new Paragraph(student.getNome(), TITLE_FONT);
        name.setAlignment(Element.ALIGN_CENTER);
        document.add(name);

        // Curso
        Paragraph course = new Paragraph(student.getCurso(), SECTION_FONT);
        course.setAlignment(Element.ALIGN_CENTER);
        document.add(course);

        document.add(Chunk.NEWLINE);

      
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);

        table.addCell(createInfoCell("E-mail:", BOLD_FONT));
        table.addCell(createInfoCell(student.getEmail(), NORMAL_FONT));

        if (student.getTelefone() != null && !student.getTelefone().isEmpty()) {
            table.addCell(createInfoCell("Telefone:", BOLD_FONT));
            table.addCell(createInfoCell(student.getTelefone(), NORMAL_FONT));
        }

        if (student.getDataNascimento() != null) {
            table.addCell(createInfoCell("Data de Nascimento:", BOLD_FONT));
            table.addCell(createInfoCell(student.getDataNascimento().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                    NORMAL_FONT));
        }

        document.add(table);
        document.add(Chunk.NEWLINE);
    }

    private void addSection(Document document, String title) throws DocumentException {
        Paragraph sectionTitle = new Paragraph(title, SECTION_FONT);
        sectionTitle.setSpacingBefore(10);
        sectionTitle.setSpacingAfter(5);
        document.add(sectionTitle);

       
        Paragraph line = new Paragraph(new Chunk(new LineSeparator()));
        document.add(line);
    }

    private void addLinks(Document document, Student student) throws DocumentException {
        boolean hasLinks = false;

        if (student.getLinkedin() != null && !student.getLinkedin().isEmpty() ||
                student.getGithub() != null && !student.getGithub().isEmpty() ||
                student.getPortfolio() != null && !student.getPortfolio().isEmpty()) {

            addSection(document, "Links");
            hasLinks = true;

            if (student.getLinkedin() != null && !student.getLinkedin().isEmpty()) {
                Paragraph linkedin = new Paragraph();
                linkedin.add(new Chunk("LinkedIn: ", BOLD_FONT));
                linkedin.add(new Chunk(student.getLinkedin(), NORMAL_FONT));
                document.add(linkedin);
            }

            if (student.getGithub() != null && !student.getGithub().isEmpty()) {
                Paragraph github = new Paragraph();
                github.add(new Chunk("GitHub: ", BOLD_FONT));
                github.add(new Chunk(student.getGithub(), NORMAL_FONT));
                document.add(github);
            }

            if (student.getPortfolio() != null && !student.getPortfolio().isEmpty()) {
                Paragraph portfolio = new Paragraph();
                portfolio.add(new Chunk("Portfólio: ", BOLD_FONT));
                portfolio.add(new Chunk(student.getPortfolio(), NORMAL_FONT));
                document.add(portfolio);
            }
        }

        if (hasLinks) {
            document.add(Chunk.NEWLINE);
        }
    }

    private PdfPCell createInfoCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setPadding(5);
        return cell;
    }

    private String formatPeriodo(String inicio, String fim, boolean atual) {
        if (atual) {
            return inicio + " - Atual";
        } else if (inicio.isEmpty() && fim.isEmpty()) {
            return "";
        } else if (inicio.isEmpty()) {
            return "Até " + fim;
        } else if (fim.isEmpty()) {
            return "Desde " + inicio;
        } else {
            return inicio + " - " + fim;
        }
    }

    private String formatSkillLevel(Integer level) {
        if (level == null)
            return "";

        switch (level) {
            case 1:
                return "Básico";
            case 2:
                return "Intermediário Baixo";
            case 3:
                return "Intermediário";
            case 4:
                return "Intermediário Alto";
            case 5:
                return "Avançado";
            default:
                return "";
        }
    }
}