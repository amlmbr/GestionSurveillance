package com.example.jeeproject.ai;

import com.example.jeeproject.entity.*;
import com.example.jeeproject.entity.Module;
import com.example.jeeproject.repo.*;
import com.example.jeeproject.services.*;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class ChatController {
    private final ChatClient chatClient;

    @Autowired private DepartementService departementService;
    @Autowired private EnseignantService enseignantService;
    @Autowired private ExamenRepository examenService;
    @Autowired private ModuleRepository moduleService;
    @Autowired private OptionRepository optionService;
    @Autowired private SurveillanceAssignationRepository surveillanceService;
    @Autowired private LocalRepository localRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private SessionRepository sessionRepository;

    public ChatController(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    @GetMapping(value = "/chatbot")
    public ResponseEntity<Map<String, String>> chatbot(@RequestParam String message) {
        // Récupérer toutes les données
        List<Departement> departements = departementService.getAllDepartements();
        List<Enseignant> enseignants = enseignantService.getAllEnseignants();
        List<Examen> examens = examenService.findAll();
        List<Module> modules = moduleService.findAll();
        List<Option> options = optionService.findAll();
        List<Local> locals = localRepository.findAll();
        List<SurveillanceAssignation> surveillances = surveillanceService.findAll();
        List<Student> students = studentRepository.findAll();
        List<Session> sessions = sessionRepository.findAll();
        // Créer le contexte complet
        String contextData = createCompleteContext(
                departements, enseignants, examens,
                modules, options, surveillances,locals,students,sessions
        );

        String systemMessage = String.format("""
            Vous êtes un assistant administratif spécialisé dans la gestion d'un établissement éducatif ensa el jadida voic sa localisation: 7H28+C96, El Jadida.
            
            Format de réponse à utiliser :
            1. Pour les informations sur les surveillances d'examens :
               ```
               📋 DÉTAILS DE LA SURVEILLANCE
               ━━━━━━━━━━━━━━━━━━━━━━━━━━
               📚 Examen : [nom de l'examen]
               📅 Date : [date]
               🏫 Département : [nom du département]
               
               👥 SURVEILLANTS
               ━━━━━━━━━━━
               [Liste des surveillants avec leur département]
               
               📌 RECOMMANDATIONS
               ━━━━━━━━━━━━━━━
               • [Points importants et recommandations]
               
               💡 SUGGESTIONS D'OPTIMISATION
               ━━━━━━━━━━━━━━━━━━━━━━━
               1. [Première suggestion]
               2. [Deuxième suggestion]
               3. [Troisième suggestion]
               ```
               
            2. Pour les statistiques et rapports :
               Utilisez des sections clairement délimitées avec des titres en gras
               et des listes à puces pour les détails.
               
            3. Pour les réponses générales :
               Structurez toujours l'information en sections logiques
               avec des titres clairs et des espacements appropriés.
            
            Instructions supplémentaires :
            - Utilisez des emojis appropriés pour améliorer la lisibilité
            - Formatez les dates de manière cohérente
            - Mettez en évidence les informations importantes
            - Numérotez les suggestions et recommandations
            - Utilisez des séparateurs pour distinguer les sections
            - ne répondrai uniquement qu'aux questions qui  sont  liées au contexte académique
            
            Données actuelles de l'établissement:
            %s
            """, contextData);

        String content = chatClient.prompt()
                .system(systemMessage)
                .user(message)
                .call()
                .content();

        Map<String, String> response = new HashMap<>();
        response.put("response", content);
        return ResponseEntity.ok(response);
    }

    private String createCompleteContext(
            List<Departement> departements,
            List<Enseignant> enseignants,
            List<Examen> examens,
            List<Module> modules,
            List<Option> options,
            List<SurveillanceAssignation> surveillances,
            List<Local> locals,
            List<Student> students,
            List<Session> sessions
            ) {

        StringBuilder context = new StringBuilder();
        context.append("=== Session ===\n");
        for (Session session : sessions) {
            context.append(String.format("- (ID: %d) date debut : %s date fin : %s type : %s confirmation :%s\n",
                    session.getId(),
                    session.getDateDebut(),
                    session.getDateFin(),
                    session.getTypeSession(),
                    session.isConfirmed()
                    ));
        }
        // Informations sur les départements
        context.append("=== DÉPARTEMENTS ===\n");
        for (Departement dept : departements) {
            context.append(String.format("- %s (ID: %d)\n",
                    dept.getNom(),
                    dept.getId()));
        }
        context.append("=== Students ===\n");
        for (Student student : students) {
            context.append(String.format("- %s (ID: %d) option: %s\n ",
                    student.getNom(),
                    student.getId(),
                    student.getOption().getNom()

            ));
        }
        context.append("=== Locaux ===\n");
        for (Local local : locals) {
            context.append(String.format("- %s (ID: %d) disponibilite :%s , type :%s\n  ",
                    local.getNom(),
                    local.getId(),
                    local.isEstDisponible(),
                    local.getType()
            ));
        }
        // Informations sur les options
        context.append("\n=== OPTIONS ===\n");
        for (Option opt : options) {
            context.append(String.format("- %s (Département: %s)\n",
                    opt.getNom(),
                    opt.getDepartement() != null ? opt.getDepartement().getNom() : "Non assigné"));
        }

        // Informations sur les modules
        context.append("\n=== MODULES ===\n");
        for (Module mod : modules) {
            context.append(String.format("- %s (Option: %s)\n",
                    mod.getNom(),
                    mod.getOption() != null ? mod.getOption().getNom() : "Non assigné"));
        }

        // Informations sur les enseignants
        context.append("\n=== ENSEIGNANTS ===\n");
        for (Enseignant ens : enseignants) {
            context.append(String.format("- %s %s (Département: %s)\n",
                    ens.getPrenom(),
                    ens.getNom(),
                    ens.getDepartement() != null ? ens.getDepartement().getNom() : "Non assigné"));
        }

        // Informations sur les examens
        context.append("\n=== EXAMENS ===\n");
        for (Examen exam : examens) {
            context.append(String.format("- Module: %s, Date: %s idsession : %s\n",
                    exam.getModuleExamen() != null ? exam.getModuleExamen().getNom() : "Non assigné",
                    exam.getDate(),
                    exam.getSession().getId()
            ));
        }

        // Informations sur les surveillances
        context.append("\n=== SURVEILLANCES ===\n");
        for (SurveillanceAssignation surv : surveillances) {
            context.append(String.format("- Examen: %s, Enseignant: %s %s SessionId: %s\n",
                    surv.getExamen() != null ? surv.getExamen().getModuleExamen().getNom() : "Non assigné",
                    surv.getEnseignant() != null ? surv.getEnseignant().getPrenom() : "",
                    surv.getEnseignant() != null ? surv.getEnseignant().getNom() : "Non assigné",
                    surv.getEnseignant().getId()
                    ));
        }

        // Statistiques générales
        context.append("\n=== STATISTIQUES ===\n");
        context.append(String.format("- Nombre de départements: %d\n", departements.size()));
        context.append(String.format("- Nombre d'enseignants: %d\n", enseignants.size()));
        context.append(String.format("- Nombre d'examens: %d\n", examens.size()));
        context.append(String.format("- Nombre de modules: %d\n", modules.size()));
        context.append(String.format("- Nombre d'options: %d\n", options.size()));
        context.append(String.format("- Nombre de surveillances: %d\n", surveillances.size()));

        // Statistiques avancées
        Map<String, Long> enseignantsParDept = enseignants.stream()
                .filter(e -> e.getDepartement() != null)
                .collect(Collectors.groupingBy(
                        e -> e.getDepartement().getNom(),
                        Collectors.counting()));

        context.append("\n=== RÉPARTITION DES ENSEIGNANTS PAR DÉPARTEMENT ===\n");
        enseignantsParDept.forEach((dept, count) ->
                context.append(String.format("  * %s: %d enseignants\n", dept, count)));

        return context.toString();
    }
}